// The interactive states compared, per this task's spec assumptions (the
// site has no language switch and exactly one dialog). `applicableAt(width)`
// says whether that state exists at all at that width - the mobile nav
// overlay's trigger is hidden at `md-and-up`.

// Vuetify 3's own JS-driven enter transitions (the mobile menu's
// `v-overlay`, the Impressum dialog's `v-dialog`) settle slower than the
// 300ms this originally guessed - confirmed by polling
// `getBoundingClientRect()` on the dialog's own title every 100ms after
// the click: still changing at 300ms, consistently settled by ~800ms.
// 900ms leaves a safety margin past that measured settle time.
const OVERLAY_TRANSITION_MS = 900;

/**
 * Clicks, waits, and - only if the thing that should have opened still
 * has not (a zero-size rect) - clicks once more. Vue's own hydration
 * (attaching the activator's real click listener over the server-
 * rendered, inert markup) is not guaranteed done the instant `page.goto`'s
 * `load` event fires; under load, a single click can land before it and
 * do nothing (confirmed once: a full `compare` run reported the
 * Impressum dialog's entire content as `missing-in-new` at one width - it
 * never opened that run). A single bounded retry recovers that without
 * the risk a *polling* retry would have on a toggle-style activator
 * (clicking again while genuinely just still mid-transition would close
 * it right back - confirmed separately, see `flipcard-flipped` below).
 */
async function clickAndEnsureOpen(page, click, selector, waitMs) {
  await click();
  await page.waitForTimeout(waitMs);
  const open = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }, selector);
  if (!open) {
    await click();
    await page.waitForTimeout(waitMs);
  }
}

export const STATES = [
  {
    name: 'default',
    applicableAt: () => true,
    apply: async () => {},
  },
  {
    name: 'nav-open',
    applicableAt: (width) => width < 960,
    apply: async (page) => {
      await clickAndEnsureOpen(
        page,
        () => page.locator('img[alt="menu"]').click(),
        'img[alt="close"]',
        OVERLAY_TRANSITION_MS,
      );
    },
  },
  {
    name: 'dialog-open',
    applicableAt: () => true,
    apply: async (page) => {
      // Footer's Impressum link is unconditional at every width. A real
      // `.click()` would scroll it into view first (it sits at the very
      // bottom of the page) and then compare every *other* element at that
      // scrolled position against the un-scrolled old build - a dispatched
      // click opens the same dialog without moving the viewport.
      const click = () =>
        page
          .locator('footer a', { hasText: 'Impressum' })
          .evaluate((el) => el.click());
      await clickAndEnsureOpen(
        page,
        click,
        '.v-card-title, .v-card__title',
        OVERLAY_TRANSITION_MS,
      );
    },
  },
  {
    name: 'flipcard-flipped',
    applicableAt: () => true,
    apply: async (page) => {
      await page.locator('.flip-card--front').first().click();
      await page.waitForTimeout(700); // CSS 0.6s flip transition
      // The CSS transition having ended (per its own stated duration)
      // does not guarantee the compositor's last frame has been flushed
      // back to the main thread yet - `getBoundingClientRect()` right at
      // the 700ms mark occasionally read a sub-pixel-to-a-few-pixel-off
      // value on the rotated card's own content, with no consistent
      // direction (confirmed: several `compare` runs in a row, same two
      // builds, each reporting a different `old`/`new` pair for the same
      // row, including which one was larger - plain per-run rounding
      // jitter, not a real difference). Two animation frames flushes it.
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
    },
  },
];
