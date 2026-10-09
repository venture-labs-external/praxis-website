// Compares two snapshots (see snapshot.mjs) taken at the same width/state on
// the old and new builds. Elements are paired by (tag, text, occurrence) -
// the Nth element with that tag+text in document order on one side is
// compared against the Nth on the other.
const TYPE_PROPS = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'color',
];
// `letterSpacing`/`fontSize` are computed from an `em` value times the
// element's own font-size, which can differ in its last decimal digit
// between the two builds' own floating-point rounding (e.g. "0.428571px"
// vs. "0.42857px" - the same 0.0178571429em at a font-size that itself
// differs by an unmeasurable fraction) without being a real difference a
// person could ever see; compared numerically, to 2 decimal places, instead
// of as an exact string.
const NUMERIC_TOLERANT_PROPS = new Set([
  'letterSpacing',
  'fontSize',
  'lineHeight',
]);
const NUMERIC_TOLERANCE = 0.01;
const BOX_TOLERANCE_PX = 1;
// 20261009-praxis-gerresheim-last-differences-to-the-live-s acceptance
// criteria's own stated tolerances - kept as named constants here, next to
// the pre-existing ones above, rather than repeated as literals below.
const SCROLL_TOLERANCE_PX = 2; // criterion 1
const SCROLL_HEIGHT_TOLERANCE_PX = 2; // criterion 3
const SCRIM_CHANNEL_TOLERANCE = 2; // criterion 3, "within 2 of 255 per channel"
const SCRIM_OPACITY_TOLERANCE = 0.01;

function px(value) {
  const n = Number.parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

function typographyPropsDiffer(prop, oldValue, newValue) {
  if (oldValue === newValue) return false;
  if (NUMERIC_TOLERANT_PROPS.has(prop)) {
    const oldPx = px(oldValue);
    const newPx = px(newValue);
    if (oldPx !== null && newPx !== null)
      return Math.abs(oldPx - newPx) > NUMERIC_TOLERANCE;
  }
  return true;
}

export function diffSnapshots(oldSnap, newSnap, { width, state, lang }) {
  const byKeyOld = new Map();
  for (const el of oldSnap.elements) {
    const id = `${el.key}#${el.occurrence}`;
    byKeyOld.set(id, el);
  }

  const differences = [];
  const matchedNewIds = new Set();

  for (const newEl of newSnap.elements) {
    const id = `${newEl.key}#${newEl.occurrence}`;
    const oldEl = byKeyOld.get(id);
    if (!oldEl) {
      differences.push({
        width,
        state,
        lang,
        tag: newEl.tag,
        text: newEl.text,
        kind: 'missing-in-old',
        detail:
          'element exists in the new build but no old-build element has the same tag+text',
      });
      continue;
    }
    matchedNewIds.add(id);

    for (const prop of TYPE_PROPS) {
      if (typographyPropsDiffer(prop, oldEl.style[prop], newEl.style[prop])) {
        differences.push({
          width,
          state,
          lang,
          tag: newEl.tag,
          text: newEl.text,
          kind: 'typography',
          property: prop,
          old: oldEl.style[prop],
          new: newEl.style[prop],
        });
      }
    }

    for (const prop of [
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
    ]) {
      const oldPx = px(oldEl.style[prop]);
      const newPx = px(newEl.style[prop]);
      if (oldPx === null || newPx === null) continue;
      if (Math.abs(oldPx - newPx) > BOX_TOLERANCE_PX) {
        differences.push({
          width,
          state,
          lang,
          tag: newEl.tag,
          text: newEl.text,
          kind: 'spacing',
          property: prop,
          old: oldEl.style[prop],
          new: newEl.style[prop],
        });
      }
    }

    if (oldEl.parentStyle && newEl.parentStyle) {
      for (const prop of ['borderRadius', 'backgroundColor']) {
        if (oldEl.parentStyle[prop] !== newEl.parentStyle[prop]) {
          differences.push({
            width,
            state,
            lang,
            tag: newEl.tag,
            text: newEl.text,
            kind: 'box',
            property: prop,
            old: oldEl.parentStyle[prop],
            new: newEl.parentStyle[prop],
          });
        }
      }
    }

    for (const [axis, oldVal, newVal] of [
      ['x', oldEl.box.x, newEl.box.x],
      ['y', oldEl.box.y, newEl.box.y],
      ['width', oldEl.box.width, newEl.box.width],
      ['height', oldEl.box.height, newEl.box.height],
    ]) {
      if (Math.abs(oldVal - newVal) > BOX_TOLERANCE_PX) {
        differences.push({
          width,
          state,
          lang,
          tag: newEl.tag,
          text: newEl.text,
          kind: 'position',
          property: axis,
          old: oldVal,
          new: newVal,
        });
      }
    }
  }

  for (const [id, oldEl] of byKeyOld) {
    if (!matchedNewIds.has(id)) {
      differences.push({
        width,
        state,
        lang,
        tag: oldEl.tag,
        text: oldEl.text,
        kind: 'missing-in-new',
        detail:
          'element exists in the old build but no new-build element has the same tag+text',
      });
    }
  }

  // The actual viewport scroll position, raw (unlike `box.y` above, which
  // adds `window.scrollY` back in on purpose to stay scroll-position-
  // invariant for ordinary layout comparisons) - this is the one check that
  // specifically wants the two builds to have ended up scrolled to the same
  // place, e.g. after a mobile-menu-entry tap (20261009-praxis-gerresheim-
  // last-differences-to-the-live-s difference 1: a build that silently
  // fails to scroll at all would otherwise go undetected, since every
  // element's own `box.y` looks identical whether the page actually
  // scrolled there or not).
  if (Math.abs(oldSnap.scrollY - newSnap.scrollY) > SCROLL_TOLERANCE_PX) {
    differences.push({
      width,
      state,
      lang,
      tag: 'window',
      text: '(scroll position)',
      kind: 'scroll-position',
      old: oldSnap.scrollY,
      new: newSnap.scrollY,
    });
  }

  if (
    oldSnap.dialogScrollHeight != null &&
    newSnap.dialogScrollHeight != null &&
    Math.abs(oldSnap.dialogScrollHeight - newSnap.dialogScrollHeight) >
      SCROLL_HEIGHT_TOLERANCE_PX
  ) {
    differences.push({
      width,
      state,
      lang,
      tag: 'v-card-text',
      text: '(dialog scroll height)',
      kind: 'scroll-height',
      old: oldSnap.dialogScrollHeight,
      new: newSnap.dialogScrollHeight,
    });
  }

  differences.push(
    ...diffProbes(oldSnap.probes, newSnap.probes, { width, state, lang }),
  );

  // Difference 7 - the one intended difference: the old site shipped
  // `<html lang="en">` despite its content being entirely German; this
  // branch corrects it to `"de"`. Checked once per width/state like
  // everything else (cheap, and `<html lang>` could in principle be
  // changed by a particular page state, even though it is not here) so the
  // allow list entry's shape matches every other difference's.
  if (oldSnap.htmlLang !== newSnap.htmlLang) {
    differences.push({
      width,
      state,
      lang,
      tag: 'html',
      text: '(lang attribute)',
      kind: 'html-lang',
      old: oldSnap.htmlLang,
      new: newSnap.htmlLang,
    });
  }

  const pageHeightDiff = Math.abs(oldSnap.pageHeight - newSnap.pageHeight);

  return {
    differences,
    pageHeightDiff,
    oldPageHeight: oldSnap.pageHeight,
    newPageHeight: newSnap.pageHeight,
  };
}

/** True if `value` (a computed `box-shadow`) actually paints anything. */
function hasVisibleShadow(value) {
  if (!value || value === 'none') return false;
  const lengths = value.match(/-?\d*\.?\d+px/g) ?? [];
  return lengths.some((l) => Number.parseFloat(l) !== 0);
}

/** Parses `rgb(r, g, b)`/`rgba(r, g, b, a)` into `[r, g, b, a]` (`a` 0-1, missing = 1), or null. */
function parseRgb(value) {
  const m =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(
      value ?? '',
    );
  if (!m) return null;
  return [
    Number(m[1]),
    Number(m[2]),
    Number(m[3]),
    m[4] === undefined ? 1 : Number(m[4]),
  ];
}

/**
 * Compares the named-selector probes `snapshot.mjs` collects (an icon-only
 * `<v-btn>`, the dialog's own scrim - neither has text, so the tag+text
 * matching above never sees them). One side having a probe the other does
 * not (the element simply is not on screen in that state on one build) is
 * reported too - the whole point of a probe existing in a given state is
 * that the spec's acceptance criteria say it must be checked there.
 */
export function diffProbes(oldProbes, newProbes, { width, state, lang }) {
  const differences = [];
  const names = new Set([
    ...Object.keys(oldProbes ?? {}),
    ...Object.keys(newProbes ?? {}),
  ]);
  for (const name of names) {
    const oldP = oldProbes?.[name];
    const newP = newProbes?.[name];
    if (!oldP && !newP) continue;
    if (!oldP || !newP) {
      differences.push({
        width,
        state,
        lang,
        tag: name,
        text: `(${name})`,
        kind: !oldP ? 'missing-in-old' : 'missing-in-new',
        detail: `probe "${name}" is on screen in only one build in this state`,
      });
      continue;
    }

    if (name === 'scrim') {
      const oldRgb = parseRgb(oldP.backgroundColor);
      const newRgb = parseRgb(newP.backgroundColor);
      if (
        oldRgb &&
        newRgb &&
        (Math.abs(oldRgb[0] - newRgb[0]) > SCRIM_CHANNEL_TOLERANCE ||
          Math.abs(oldRgb[1] - newRgb[1]) > SCRIM_CHANNEL_TOLERANCE ||
          Math.abs(oldRgb[2] - newRgb[2]) > SCRIM_CHANNEL_TOLERANCE)
      ) {
        differences.push({
          width,
          state,
          lang,
          tag: 'scrim',
          text: '(scrim colour)',
          kind: 'scrim-color',
          property: 'backgroundColor',
          old: oldP.backgroundColor,
          new: newP.backgroundColor,
        });
      }
      const oldOpacity = px(oldP.opacity);
      const newOpacity = px(newP.opacity);
      if (
        oldOpacity !== null &&
        newOpacity !== null &&
        Math.abs(oldOpacity - newOpacity) > SCRIM_OPACITY_TOLERANCE
      ) {
        differences.push({
          width,
          state,
          lang,
          tag: 'scrim',
          text: '(scrim opacity)',
          kind: 'scrim-opacity',
          property: 'opacity',
          old: oldP.opacity,
          new: newP.opacity,
        });
      }
      continue;
    }

    for (const prop of ['backgroundColor', 'boxShadow', 'borderRadius']) {
      if (
        prop === 'boxShadow' &&
        !hasVisibleShadow(oldP[prop]) &&
        !hasVisibleShadow(newP[prop])
      ) {
        // Vuetify 2's "flat"/"text"-equivalent buttons compute `box-shadow:
        // none`; Vuetify 3's own `.v-btn--variant-flat`/`--variant-text`
        // instead always emit a (longhand) 3-layer box-shadow with every
        // offset/blur/spread at `0px` - visually identical (nothing to
        // see), textually different. Treated as equal; a *real* shadow
        // (FlipCard's own pre-fix bug) always has a non-zero value in it.
        continue;
      }
      if (oldP[prop] !== newP[prop]) {
        differences.push({
          width,
          state,
          lang,
          tag: name,
          text: `(${name})`,
          kind: 'style',
          property: prop,
          old: oldP[prop],
          new: newP[prop],
        });
      }
    }
    for (const [axis, oldVal, newVal] of [
      ['x', oldP.box.x, newP.box.x],
      ['y', oldP.box.y, newP.box.y],
      ['width', oldP.box.width, newP.box.width],
      ['height', oldP.box.height, newP.box.height],
    ]) {
      if (Math.abs(oldVal - newVal) > BOX_TOLERANCE_PX) {
        differences.push({
          width,
          state,
          lang,
          tag: name,
          text: `(${name})`,
          kind: 'position',
          property: axis,
          old: oldVal,
          new: newVal,
        });
      }
    }
  }
  return differences;
}
