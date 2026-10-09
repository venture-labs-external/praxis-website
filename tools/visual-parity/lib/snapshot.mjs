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

  const results = [];
  const counters = new Map();
  const all = document.querySelectorAll('body *');
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
