/**
 * Unit tests for utils/reveal.js
 *
 * Tests the reveal logic (shouldAnimate, inserted, unbind) using fake window,
 * IntersectionObserver and element objects, without a DOM or transpiler.
 */

const test = require('node:test');
const assert = require('node:assert');
const reveal = require('../utils/reveal');

const {
  REVEAL_IN_CLASS,
  REVEAL_OBSERVER_OPTIONS,
  REVEAL_PENDING_CLASS,
  createRevealDirective,
  shouldAnimate,
} = reveal;

// Helper: create a fake element with classList mock
function fakEl() {
  const classes = new Set();
  return {
    classList: {
      add(cls) {
        classes.add(cls);
      },
      contains(cls) {
        return classes.has(cls);
      },
      get list() {
        return Array.from(classes);
      },
    },
  };
}

// ============================================================================
// Criterion 8: shouldAnimate
// ============================================================================

test('Criterion 8.1: shouldAnimate returns false without IntersectionObserver', (_t) => {
  const win = {};
  assert.strictEqual(shouldAnimate(win), false);
});

test('Criterion 8.2: shouldAnimate returns false when prefers-reduced-motion: reduce', (_t) => {
  const win = {
    IntersectionObserver: function () {},
    matchMedia(query) {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true };
      }
      return { matches: false };
    },
  };
  assert.strictEqual(shouldAnimate(win), false);
});

test('Criterion 8.3: shouldAnimate returns true with IntersectionObserver and matches: false', (_t) => {
  const win = {
    IntersectionObserver: function () {},
    matchMedia(_query) {
      return { matches: false };
    },
  };
  assert.strictEqual(shouldAnimate(win), true);
});

test('Criterion 8.4: matchMedia is called with exact query string', (_t) => {
  let queryCalled = null;
  const win = {
    IntersectionObserver: function () {},
    matchMedia(query) {
      queryCalled = query;
      return { matches: false };
    },
  };
  shouldAnimate(win);
  assert.strictEqual(queryCalled, '(prefers-reduced-motion: reduce)');
});

// ============================================================================
// Criterion 9: inserted with animation allowed
// ============================================================================

test('Criterion 9.1: inserted adds reveal--pending when animation allowed', (_t) => {
  const el = fakEl();
  const win = {
    IntersectionObserver: function () {
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  assert.strictEqual(el.classList.contains(REVEAL_PENDING_CLASS), true);
});

test('Criterion 9.2: inserted observes with correct threshold and rootMargin', (_t) => {
  const el = fakEl();
  let capturedOptions = null;

  const win = {
    IntersectionObserver: function (callback, options) {
      capturedOptions = options;
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  assert.deepStrictEqual(capturedOptions, REVEAL_OBSERVER_OPTIONS);
  assert.strictEqual(capturedOptions.threshold, 0.15);
  assert.strictEqual(capturedOptions.rootMargin, '0px 0px -10% 0px');
});

test('Criterion 9.3: inserted does not add class when shouldAnimate is false', (_t) => {
  const el = fakEl();
  const win = {
    matchMedia(_q) {
      return { matches: true }; // Reduce motion enabled
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  assert.strictEqual(el.classList.contains(REVEAL_PENDING_CLASS), false);
});

test('Criterion 9.4: inserted does not create observer when shouldAnimate is false', (_t) => {
  const el = fakEl();
  let observerCreated = false;

  const win = {
    IntersectionObserver: function () {
      observerCreated = true;
    },
    matchMedia(_q) {
      return { matches: true };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  assert.strictEqual(observerCreated, false);
});

// ============================================================================
// Criterion 10: First intersection (reveal)
// ============================================================================

test('Criterion 10.1: On first intersecting entry, element gains reveal--in', (_t) => {
  const el = fakEl();
  let observerCallback = null;

  const win = {
    IntersectionObserver: function (callback) {
      observerCallback = callback;
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  // Simulate intersection
  const entry = { isIntersecting: true, target: el };
  observerCallback([entry]);

  assert.strictEqual(el.classList.contains(REVEAL_IN_CLASS), true);
});

test('Criterion 10.2: reveal--pending is kept after adding reveal--in', (_t) => {
  const el = fakEl();
  let observerCallback = null;

  const win = {
    IntersectionObserver: function (callback) {
      observerCallback = callback;
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  // Simulate intersection
  const entry = { isIntersecting: true, target: el };
  observerCallback([entry]);

  assert.strictEqual(el.classList.contains(REVEAL_PENDING_CLASS), true);
  assert.strictEqual(el.classList.contains(REVEAL_IN_CLASS), true);
});

test('Criterion 10.3: unobserve is called once on first intersection', (_t) => {
  const el = fakEl();
  let observerCallback = null;
  let unobserveCount = 0;

  const win = {
    IntersectionObserver: function (callback) {
      observerCallback = callback;
      this.observe = () => {};
      this.unobserve = () => {
        unobserveCount++;
      };
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  const entry = { isIntersecting: true, target: el };
  observerCallback([entry]);

  assert.strictEqual(unobserveCount, 1);
});

test('Criterion 10.4: Non-intersecting entry changes nothing', (_t) => {
  const el = fakEl();
  let observerCallback = null;
  let unobserveCount = 0;

  const win = {
    IntersectionObserver: function (callback) {
      observerCallback = callback;
      this.observe = () => {};
      this.unobserve = () => {
        unobserveCount++;
      };
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);

  // Simulate non-intersection
  const entry = { isIntersecting: false, target: el };
  observerCallback([entry]);

  assert.strictEqual(el.classList.contains(REVEAL_IN_CLASS), false);
  assert.strictEqual(unobserveCount, 0);
});

// ============================================================================
// Criterion 11: unbind
// ============================================================================

test('Criterion 11.1: unbind disconnects the observer', (_t) => {
  const el = fakEl();
  let disconnectCalled = false;

  const win = {
    IntersectionObserver: function () {
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {
        disconnectCalled = true;
      };
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el);
  directive.unbind(el);

  assert.strictEqual(disconnectCalled, true);
});

test('Criterion 11.2: unbind handles missing observer gracefully', (_t) => {
  const el = fakEl();
  const directive = createRevealDirective(() => ({}));

  // Should not throw
  directive.unbind(el);
  assert.ok(true);
});

// ============================================================================
// Criterion 13: Two elements get separate observers
// ============================================================================

test('Criterion 13.1: Two elements get separate observers', (_t) => {
  const el1 = fakEl();
  const el2 = fakEl();
  let observerCount = 0;

  const win = {
    IntersectionObserver: function () {
      observerCount++;
      this.observe = () => {};
      this.unobserve = () => {};
      this.disconnect = () => {};
    },
    matchMedia(_q) {
      return { matches: false };
    },
  };

  const directive = createRevealDirective(() => win);
  directive.inserted(el1);
  directive.inserted(el2);

  assert.strictEqual(observerCount, 2);
});
