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
const BOX_TOLERANCE_PX = 1;

function px(value) {
  const n = Number.parseFloat(value);
  return Number.isNaN(n) ? null : n;
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
      if (oldEl.style[prop] !== newEl.style[prop]) {
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

  const pageHeightDiff = Math.abs(oldSnap.pageHeight - newSnap.pageHeight);

  return {
    differences,
    pageHeightDiff,
    oldPageHeight: oldSnap.pageHeight,
    newPageHeight: newSnap.pageHeight,
  };
}
