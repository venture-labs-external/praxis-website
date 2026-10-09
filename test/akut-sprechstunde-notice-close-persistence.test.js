// Covers the Reviewer finding fixed in this round (Christian, 2026-10-09):
// the dismissal must be remembered whichever of the three ways the dialog
// closes - the X button, Escape, and a click on the dark overlay - not only
// the X button's own @click handler.
//
// From AkutSprechstundeNotice.vue's own point of view, Escape and an
// overlay click are indistinguishable from each other: both close the
// dialog purely through v-dialog's `v-model="dialogOpen"` binding, inside
// Vuetify's own code, never calling this component's `close()` method. That
// is exactly the bug - and exactly why the fix is a `watch: { dialogOpen }`
// that reacts to the value itself rather than to any one trigger. This test
// therefore drives that same observable surface for each of the three
// triggers: `close()` for the X button, and a direct `dialogOpen = false`
// write (what v-dialog does internally for both Escape and the overlay) for
// the other two - then proves each one persists the one localStorage entry,
// that a simulated reload keeps the dialog closed and shows the pill, and
// that the pill's reopen() does not re-write that entry.
//
// Runs as a plain Node script against the real component file (no new
// npm dependency: `vue` and `@vue/compiler-sfc` are already installed by
// `nuxt`/`vuetify-nuxt-module`) - `node test/akut-sprechstunde-notice-close-persistence.test.js`.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parse } = require('@vue/compiler-sfc');
const { reactive, watch, nextTick } = require('vue');

const COMPONENT_PATH = path.join(
  __dirname,
  '..',
  'components',
  'AkutSprechstundeNotice.vue',
);

// A tiny in-memory localStorage, scoped per "browser session" below.
function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
}

// Reads the component's <script> block from the real .vue file once -
// the exact source the browser runs, not a re-implementation of it.
const COMPONENT_SCRIPT = (() => {
  const source = fs.readFileSync(COMPONENT_PATH, 'utf8');
  const { descriptor } = parse(source);
  return descriptor.script.content.replace(
    'export default',
    'module.exports =',
  );
})();

// Evaluates the component's script in its own vm context for this one
// instance, with `window.localStorage` wired to the given storage from the
// start - a function closes over the global of the realm it was DEFINED in,
// so `window` must already be correct in the sandbox before the methods are
// created, not patched onto it afterwards.
function loadComponentOptions(storage) {
  const sandbox = {
    module: { exports: {} },
    window: { localStorage: storage },
  };
  vm.runInNewContext(COMPONENT_SCRIPT, sandbox, { filename: COMPONENT_PATH });
  return sandbox.module.exports;
}

// Wires one instance of the component's data/watch/mounted/methods onto a
// reactive state backed by the given localStorage, the same way Vue's
// Options API would - close enough to prove the watcher actually fires,
// not just that the functions exist.
function createInstance(storage) {
  const options = loadComponentOptions(storage);
  const state = reactive(options.data());
  const ctx = state;
  Object.keys(options.methods).forEach((name) => {
    ctx[name] = options.methods[name].bind(ctx);
  });
  Object.entries(options.watch || {}).forEach(([key, handler]) => {
    watch(
      () => state[key],
      (value) => handler.call(ctx, value),
      { flush: 'sync' },
    );
  });
  return { state, ctx, mount: () => options.mounted.call(ctx) };
}

async function run() {
  let failures = 0;

  function check(label, actual, expected) {
    try {
      assert.deepEqual(actual, expected);
      console.log(`  ok - ${label}`);
    } catch {
      failures += 1;
      console.error(
        `  FAIL - ${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      );
    }
  }

  // --- Path 1: the X button (close()) ---------------------------------
  {
    const storage = createMemoryStorage();
    const { state, ctx, mount } = createInstance(storage);
    mount();
    check('X button: dialog opens on first visit', state.dialogOpen, true);
    ctx.close();
    await nextTick();
    check('X button: dialog is closed', state.dialogOpen, false);
    check(
      'X button: localStorage now holds the close entry',
      storage.getItem('akutSprechstundeNoticeClosedAt') !== null,
      true,
    );
    check('X button: the pill is shown', state.pillVisible, true);

    // Simulated reload: a fresh instance, same storage.
    const second = createInstance(storage);
    second.mount();
    check(
      'X button, after reload: dialog does not reopen',
      second.state.dialogOpen,
      false,
    );
    check(
      'X button, after reload: the pill still reopens it',
      second.state.pillVisible,
      true,
    );
    second.ctx.reopen();
    check(
      'X button, after reload: reopen() shows the dialog again',
      second.state.dialogOpen,
      true,
    );
  }

  // --- Path 2: Escape (closes purely via v-model, like v-dialog does) --
  {
    const storage = createMemoryStorage();
    const { state, mount } = createInstance(storage);
    mount();
    check('Escape: dialog opens on first visit', state.dialogOpen, true);
    // Escape never calls close() - v-dialog flips v-model's bound value
    // directly, exactly like this, which is the bug the Reviewer found.
    state.dialogOpen = false;
    await nextTick();
    check(
      'Escape: localStorage now holds the close entry',
      storage.getItem('akutSprechstundeNoticeClosedAt') !== null,
      true,
    );
    check('Escape: the pill is shown', state.pillVisible, true);

    const second = createInstance(storage);
    second.mount();
    check(
      'Escape, after reload: dialog does not reopen',
      second.state.dialogOpen,
      false,
    );
    check(
      'Escape, after reload: the pill still reopens it',
      second.state.pillVisible,
      true,
    );
  }

  // --- Path 3: a click on the overlay (same v-model path as Escape) ----
  {
    const storage = createMemoryStorage();
    const { state, mount } = createInstance(storage);
    mount();
    check('Overlay click: dialog opens on first visit', state.dialogOpen, true);
    state.dialogOpen = false;
    await nextTick();
    check(
      'Overlay click: localStorage now holds the close entry',
      storage.getItem('akutSprechstundeNoticeClosedAt') !== null,
      true,
    );
    check('Overlay click: the pill is shown', state.pillVisible, true);

    const second = createInstance(storage);
    second.mount();
    check(
      'Overlay click, after reload: dialog does not reopen',
      second.state.dialogOpen,
      false,
    );
    check(
      'Overlay click, after reload: the pill still reopens it',
      second.state.pillVisible,
      true,
    );
  }

  // --- reopen() must not itself write a new close entry ----------------
  {
    const storage = createMemoryStorage();
    const { state, ctx, mount } = createInstance(storage);
    mount();
    state.dialogOpen = false;
    await nextTick();
    const closedAt = JSON.parse(
      storage.getItem('akutSprechstundeNoticeClosedAt'),
    ).closedAt;
    ctx.reopen();
    await nextTick();
    check('reopen(): dialog opens again', state.dialogOpen, true);
    const closedAtAfterReopen = JSON.parse(
      storage.getItem('akutSprechstundeNoticeClosedAt'),
    ).closedAt;
    check(
      'reopen(): does not rewrite the stored close entry',
      closedAtAfterReopen,
      closedAt,
    );
  }

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll assertions passed.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
