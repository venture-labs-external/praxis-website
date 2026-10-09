// Criterion 9 (spec docs/specs/20261007-praxis-gerresheim-akut-sprechstunde-notice-on-op.md):
// "the notice text is present in the generated dist/index.html (not injected by JS only)".
//
// This is a plain Node script (no test runner in this repo), run directly:
//   node test/akut-sprechstunde-notice-static-html.test.js
// It requires `dist/index.html` to already exist - run the repo's own build command first
// (`yarn generate`, inside the Node container named by .nvmrc; see README.md), then run this.
//
// Why this check exists on its own, separate from the close-persistence test: that test proves
// the component's *logic* against its own <script> block; this one proves what a browser with
// JavaScript disabled, or a search engine crawler, actually receives - the literal HTML Nuxt
// wrote to disk. The two can disagree (and did: round 3 found the migrated Vuetify 3 stack gates
// all v-dialog/v-overlay content behind client-side hydration regardless of the `eager` prop -
// node_modules/vuetify/lib/composables/hydration.js - so the notice's text, present and correct
// in the component and in locales/de/homepage.js, never reaches the static HTML at all).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const DIST_INDEX = path.join(__dirname, '..', 'dist', 'index.html');
const LOCALE_DE = path.join(__dirname, '..', 'locales', 'de', 'homepage.js');

function loadLocaleStrings() {
  const source = fs.readFileSync(LOCALE_DE, 'utf8');
  // The locale file is a plain JS object literal (`export default { ... }`); extract the three
  // string values this check cares about without needing a full JS module loader.
  const pick = (key) => {
    const match = source.match(new RegExp(`${key}:\\s*'([^']+)'`));
    if (!match) {
      throw new Error(`locales/de/homepage.js has no string literal for "${key}"`);
    }
    return match[1];
  };
  return {
    headline: pick('akutNoticeHeadline'),
    validity: pick('akutNoticeValidity'),
    phone: pick('akutNoticePhone'),
  };
}

function run() {
  if (!fs.existsSync(DIST_INDEX)) {
    console.error(
      `FAIL - ${DIST_INDEX} does not exist. Run the repo's build first ` +
        '(yarn generate, inside the Node container named by .nvmrc), then re-run this test.',
    );
    process.exit(1);
  }

  const html = fs.readFileSync(DIST_INDEX, 'utf8');
  const { headline, validity, phone } = loadLocaleStrings();

  let failures = 0;
  const check = (label, value) => {
    if (html.includes(value)) {
      console.log(`  ok - dist/index.html contains the ${label} verbatim`);
    } else {
      failures += 1;
      console.error(
        `  FAIL - dist/index.html does not contain the ${label} verbatim: ${JSON.stringify(value)}`,
      );
    }
  };

  check('headline (homepage.akutNoticeHeadline)', headline);
  check('validity line (homepage.akutNoticeValidity)', validity);
  check('phone text (homepage.akutNoticePhone)', phone);
  check('tel: link', 'tel:+49211285009');

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll assertions passed.');
}

run();
