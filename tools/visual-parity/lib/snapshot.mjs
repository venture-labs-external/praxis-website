// Runs inside the page (via page.evaluate). Pure DOM/CSSOM - no framework
// API - so it works unchanged against the Vue 2/Vuetify 2 build and the
// Vue 3/Vuetify 3 build. Elements are matched across the two builds by
// (tag name, normalised text) - the task's components were ported with the
// same template markup, so the same text keeps the same tag; only the CSS
// classes Vuetify generates changed, which is exactly what this ignores.
export function collectSnapshot() {
  function normalize(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function isLeafTextElement(el) {
    if (!el.childNodes || el.childNodes.length === 0) return false;
    let hasDirectText = false;
    for (const node of el.childNodes) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        normalize(node.textContent) !== ''
      ) {
        hasDirectText = true;
      }
    }
    return hasDirectText;
  }

  // When a full-viewport overlay (the mobile nav menu, or a dialog's own
  // backdrop) is open, the page behind its scrim is not actually visible -
  // but it is not `display:none` either (zero-size filter below would not
  // catch it), and Vue 3's `<v-overlay>`/`<v-dialog>` teleport their content
  // to a different point in the DOM than Vue 2's did, so the *same* text
  // appearing once in the open overlay and once underneath it can end up
  // matched to a *different* occurrence of itself across the two builds
  // (e.g. "Services" as a mobile-menu link and as a section heading).
  // Restricting collection to the overlay's own content once one covers
  // (most of) the viewport avoids comparing the hidden background at all.
  const viewportArea = window.innerWidth * window.innerHeight;
  const scrimOverlay = [
    ...document.querySelectorAll('[class*="overlay"]'),
  ].find((el) => {
    const r = el.getBoundingClientRect();
    return r.width * r.height >= viewportArea * 0.8;
  });

  const results = [];
  const counters = new Map();
  const all = scrimOverlay
    ? scrimOverlay.querySelectorAll('*')
    : document.querySelectorAll('body *');
  for (const el of all) {
    if (!isLeafTextElement(el)) continue;
    const text = normalize(el.textContent);
    if (!text) continue;
    const rect0 = el.getBoundingClientRect();
    // Skip anything not actually on screen right now (closed dialogs/
    // overlays, v-show="false" duplicates such as FlipCard's back face or
    // the desktop nav items hidden at a narrow width) - otherwise it is
    // matched by (tag, text, occurrence) against a *different* visible
    // element on the other build purely because its hidden duplicate
    // happens to sit at a different point in document order there.
    if (rect0.width === 0 && rect0.height === 0) continue;
    // Skip the page content behind an open modal dialog: Vuetify scroll-
    // locks the body while a v-dialog is open by repositioning it with a
    // large negative offset (a well-known scroll-lock technique), and the
    // two versions do not use the exact same offset - only the dialog's own
    // content (and anything else still really on screen, within a generous
    // multiple of the tallest viewport this task checks) matters while a
    // dialog is open.
    if (Math.abs(rect0.top) > 5000) continue;
    const tag = el.tagName.toLowerCase();
    const key = `${tag}|${text}`;
    const occurrence = counters.get(key) ?? 0;
    counters.set(key, occurrence + 1);

    const cs = getComputedStyle(el);
    const rect = rect0;
    const parent = el.parentElement;
    const parentCs = parent ? getComputedStyle(parent) : null;

    results.push({
      key,
      occurrence,
      tag,
      text,
      style: {
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        textAlign: cs.textAlign,
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
      },
      parentStyle: parentCs
        ? {
            borderRadius: parentCs.borderRadius,
            backgroundColor: parentCs.backgroundColor,
          }
        : null,
      box: {
        x: Math.round(rect.x),
        y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
    });
  }

  return {
    elements: results,
    pageHeight: Math.round(document.documentElement.scrollHeight),
  };
}
