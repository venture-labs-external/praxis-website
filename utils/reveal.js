/**
 * Scroll-reveal logic for the section entrance animation.
 *
 * Kept free of Vue and of any direct DOM access — the window is injected — so
 * that it can be required straight from `node --test` without a transpiler.
 *
 * The rule the whole treatment rests on: JavaScript opts an element *out* of
 * visibility, never into it. The markup and the stylesheet leave every section
 * fully visible; only `inserted` adds `reveal--pending`. If JavaScript is
 * absent, blocked or slow, no class is ever added and the content is simply
 * there.
 */

const REVEAL_PENDING_CLASS = 'reveal--pending';
const REVEAL_IN_CLASS = 'reveal--in';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const REVEAL_OBSERVER_OPTIONS = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
};

/**
 * Whether the reveal may hide anything at all.
 *
 * @param {object} win window-like object
 * @returns {boolean} false without IntersectionObserver or under Reduce Motion
 */
function shouldAnimate(win) {
  if (!win || !win.IntersectionObserver) {
    return false;
  }
  if (typeof win.matchMedia !== 'function') {
    return true;
  }
  const query = win.matchMedia(REDUCED_MOTION_QUERY);
  return !(query && query.matches);
}

function defaultGetWindow() {
  return typeof window === 'undefined' ? undefined : window;
}

/**
 * Builds the `v-reveal` directive definition.
 *
 * @param {Function} [getWindow] returns the window-like object; defaults to the
 *   real `window` when there is one (the hooks below only run client-side).
 * @returns {{ inserted: Function, unbind: Function }} directive definition
 */
function createRevealDirective(getWindow) {
  const resolveWindow = getWindow || defaultGetWindow;
  const observers = new WeakMap();

  return {
    inserted(el) {
      const win = resolveWindow();
      if (!shouldAnimate(win)) {
        return;
      }

      el.classList.add(REVEAL_PENDING_CLASS);

      const observer = new win.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          // Keep `reveal--pending` so the transition it carries still applies,
          // and stop observing so a revealed section is never re-hidden.
          entry.target.classList.add(REVEAL_IN_CLASS);
          observer.unobserve(entry.target);
        });
      }, REVEAL_OBSERVER_OPTIONS);

      observer.observe(el);
      observers.set(el, observer);
    },

    unbind(el) {
      const observer = observers.get(el);
      if (!observer) {
        return;
      }
      observer.disconnect();
      observers.delete(el);
    },
  };
}

module.exports = {
  REVEAL_IN_CLASS,
  REVEAL_OBSERVER_OPTIONS,
  REVEAL_PENDING_CLASS,
  createRevealDirective,
  shouldAnimate,
};
