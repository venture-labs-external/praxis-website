// The interactive states compared, per this task's spec assumptions (the
// site has no language switch and exactly one dialog). `applicableAt(width)`
// says whether that state exists at all at that width - the mobile nav
// overlay's trigger is hidden at `md-and-up`.
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
      await page.locator('img[alt="menu"]').click();
      await page.waitForTimeout(300); // v-overlay transition
    },
  },
  {
    name: 'dialog-open',
    applicableAt: () => true,
    apply: async (page) => {
      // Footer's Impressum link is unconditional at every width.
      await page.locator('footer a', { hasText: 'Impressum' }).click();
      await page.waitForTimeout(300); // v-dialog transition
    },
  },
  {
    name: 'flipcard-flipped',
    applicableAt: () => true,
    apply: async (page) => {
      await page.locator('.flip-card--front').first().click();
      await page.waitForTimeout(700); // CSS 0.6s flip transition
    },
  },
];
