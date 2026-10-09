// Runs inside the page (via page.evaluate). Pure DOM/CSSOM - no framework
// API - so it works unchanged against the Vue 2/Vuetify 2 build and the
// Vue 3/Vuetify 3 build. Elements are matched across the two builds by
// (scope, tag name, normalised text) - the task's components were ported
// with the same template markup, so the same text keeps the same tag and
// the same custom (non-Vuetify-generated) container class; only the CSS
// classes Vuetify itself generates changed, which is exactly what this
// ignores.
//
// `scope` exists because Vue 3's `<v-overlay>` (the mobile nav menu is a
// bare `<v-overlay>`, the Impressum dialog is a `<v-dialog>` built on top
// of it) teleports its content to a `.v-overlay-container` appended as the
// last child of `<body>` - a different place in document order than Vue
// 2's own `<v-overlay>`, which renders inline where it is used in the
// template. The mobile menu's own "Services" link and the page's "Services"
// section heading share a tag+text pair; matching by raw document-order
// occurrence pairs the Nth occurrence in one build against the Nth in the
// other, and a teleport changes which element that Nth occurrence is. The
// mobile menu keeps its own custom `nav__menu` class (identical source
// markup in both builds, confirmed against the `dev` branch's own
// `Navigation.vue`) regardless of where Vue moves it in the DOM, so using
// it as a scope key - instead of raw document order - keeps the menu's own
// occurrences bucketed separately from the page's, in both builds alike.
//
// Declared *inside* `collectSnapshot` on purpose: `page.evaluate` ships only
// this function's own source (`Function.prototype.toString`) into the page,
// not any module-level binding around it - a `const` here at the top level
// of this file would be `undefined` at runtime in the browser.
export function collectSnapshot() {
  const SCOPE_ROOTS = [{ scope: 'nav-menu', selector: '.nav__menu' }];

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
    // Skip the page content behind an open modal dialog: Vuetify scroll-
    // locks the body while a v-dialog is open by repositioning it with a
    // large negative offset (a well-known scroll-lock technique), and the
    // two versions do not use the exact same offset - only the dialog's own
    // content (and anything else still really on screen, within a generous
    // multiple of the tallest viewport this task checks) matters while a
    // dialog is open.
    if (Math.abs(rect0.top) > 5000) continue;
    const tag = el.tagName.toLowerCase();
    const scopeRoot = SCOPE_ROOTS.find(({ selector }) => el.closest(selector));
    const scope = scopeRoot ? scopeRoot.scope : 'page';
    const key = `${scope}|${tag}|${text}`;
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
