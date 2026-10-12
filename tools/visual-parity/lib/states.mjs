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

// Upper safety bound for `waitForScrollSettled` below: the menu's own
// close-transition length (confirmed, Navigation.vue's `scrollTo` comment)
// before `goTo`'s own 500ms scroll animation even starts, plus the same
// generous margin the flat wait this replaces used - kept as a ceiling so a
// tap can never end up measured as slower than that flat wait would have
// made it, even if `scrollY` never settles for some reason.
const SCROLL_SETTLE_TIMEOUT_MS = OVERLAY_TRANSITION_MS + 1500;
const SCROLL_SETTLE_POLL_MS = 50;
// Number of consecutive identical `scrollY` reads, `SCROLL_SETTLE_POLL_MS`
// apart, required before the scroll position is considered settled - a
// single identical read can land on the animation easing's own brief
// plateau mid-flight (confirmed: a shorter margin read `scrollY` mid-
// animation under load once, see the flat-wait comment this replaces).
const SCROLL_SETTLE_STABLE_READS = 3;

/**
 * Polls `window.scrollY` until it stops changing (`SCROLL_SETTLE_STABLE_
 * READS` identical reads in a row), or `SCROLL_SETTLE_TIMEOUT_MS` passes -
 * used both to wait out the mobile-menu-entry tap's own scroll animation
 * and, via its own elapsed time, to measure how long that animation
 * actually took (criterion 2/3 of this task's spec).
 *
 * An unchanged read is only trusted as "settled" once either `scrollY` has
 * moved at least once already (so an unchanged read afterwards is the
 * animation's own end, not just a value that has not started moving yet),
 * or `OVERLAY_TRANSITION_MS` - the longest the overlay's own close
 * transition (and, on the new build, Navigation.vue's own lock-clear poll)
 * can plausibly still be blocking the scroll from starting at all - has
 * already passed. Without that guard, a tap whose menu/lock takes a while
 * to clear reads several identical "still at the old position" samples in
 * a row *before* the scroll animation has even begun, and gets reported
 * as "settled" at the wrong (pre-tap) position - confirmed: an early
 * version of this function did exactly that against the unfixed flat
 * 900ms wait, reporting a tap settled at `scrollY: 0` while the page was
 * still actually mid-close, menu still open.
 */
async function waitForScrollSettled(page) {
  const start = Date.now();
  let lastY = await page.evaluate(() => window.scrollY);
  let changedAtLeastOnce = false;
  let stableCount = 0;
  while (Date.now() - start < SCROLL_SETTLE_TIMEOUT_MS) {
    await page.waitForTimeout(SCROLL_SETTLE_POLL_MS);
    const y = await page.evaluate(() => window.scrollY);
    if (y !== lastY) {
      changedAtLeastOnce = true;
      lastY = y;
      stableCount = 0;
      continue;
    }
    if (changedAtLeastOnce || Date.now() - start >= OVERLAY_TRANSITION_MS) {
      stableCount += 1;
      if (stableCount >= SCROLL_SETTLE_STABLE_READS) break;
    }
  }
  return Date.now() - start;
}

// Difference 1: a tap on *any* mobile-menu entry must still close the menu
// and scroll to its target - one state per entry (`Navigation.vue`'s own
// `menuList`: Home, Jüngste Nachrichten/News, Services), by index rather
// than by text (the text is locale-dependent, the index is not). Bounded to
// `MOBILE_MENU_ENTRY_COUNT` rather than discovered at run time so a state
// that silently stops existing (a future menu-list change dropping an
// entry) is itself a `missing-in-*` difference the report shows, not a
// state that quietly disappears from the comparison. Declared before
// `STATES` (which spreads its result) - a `const`/`function` referenced
// from inside an array literal must already be initialised by the time
// that literal evaluates, unlike a function declaration hoisted to the top
// of the whole module.
const MOBILE_MENU_ENTRY_COUNT = 3;
function mobileMenuEntryStates() {
  return Array.from({ length: MOBILE_MENU_ENTRY_COUNT }, (_, index) => ({
    name: `mobile-menu-entry-${index}`,
    applicableAt: (width) => width < 960,
    // Returns `{ scrollTapMs }` - the elapsed time from the entry's own
    // click to the page's scroll position settling (null when the entry
    // itself does not exist at all, e.g. a future menu-list change) - read
    // by run.mjs to compare the old and new build's own tap-to-settled
    // time against each other (this task's criterion 2).
    apply: async (page) => {
      await clickAndEnsureOpen(
        page,
        () => page.locator('img[alt="menu"]').click(),
        'img[alt="close"]',
        OVERLAY_TRANSITION_MS,
      );
      const items = page.locator('.list__item--mobile');
      if ((await items.count()) <= index) return { scrollTapMs: null };
      const start = Date.now();
      await items.nth(index).click();
      await waitForScrollSettled(page);
      return { scrollTapMs: Date.now() - start };
    },
  }));
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
  // 20261009-praxis-gerresheim-last-differences-to-the-live-s: the states
  // below exist to catch the 7 differences that slipped past the original
  // 4 states (none of them ever tapped a menu entry, hovered anything, or
  // opened the dialog from the menu).
  {
    name: 'card-button-hover',
    // Difference 2: the FlipCard's own front-face arrow button.
    applicableAt: () => true,
    apply: async (page) => {
      await page.locator('.flip-card--front .v-btn').first().hover();
      await page.waitForTimeout(300);
    },
  },
  {
    name: 'header-button-hover',
    // Difference 6 - the "Termin buchen" nav button only exists at
    // `md-and-up` (`v-show="mdAndUp"` in Navigation.vue); hidden below it.
    applicableAt: (width) => width >= 960,
    apply: async (page) => {
      await page.locator('.nav__button').hover();
      await page.waitForTimeout(300);
    },
  },
  {
    name: 'dialog-open-from-menu',
    // Differences 3-5, the other half of "opened both from the footer and
    // from the menu" - only reachable where the mobile menu exists at all.
    applicableAt: (width) => width < 960,
    apply: async (page) => {
      await clickAndEnsureOpen(
        page,
        () => page.locator('img[alt="menu"]').click(),
        'img[alt="close"]',
        OVERLAY_TRANSITION_MS,
      );
      const click = () =>
        page
          .locator('.nav__menu a', { hasText: 'Impressum' })
          .evaluate((el) => el.click());
      await clickAndEnsureOpen(
        page,
        click,
        '.v-card-title, .v-card__title',
        OVERLAY_TRANSITION_MS,
      );
    },
  },
  ...mobileMenuEntryStates(),
];
