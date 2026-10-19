// Acceptance criteria 1-5 (docs/specs/20261019-praxis-gerresheim-reword-the-services-card-notfa.md):
// the Services card's `suddenlyIll` string (components/Services.vue:79, key homepage.suddenlyIll)
// no longer invites a walk-in visit, states the appointment-only sentence verbatim, carries the
// call-to-phone block from the Akut-Sprechstunde notice (VL-7-S1) with no Doctolib mention, while
// `emergencyConsultation` and every other locale key stay byte-identical.
//
// Plain Node script (no test runner in this repo), run directly:
//   node test/services-card-notfallsprechstunde-reword.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const LOCALE_DE = path.join(__dirname, '..', 'locales', 'de', 'homepage.js');

function loadLocaleStrings() {
  const source = fs.readFileSync(LOCALE_DE, 'utf8');
  const pick = (key) => {
    const match = source.match(new RegExp(`${key}:\\s*\\n?\\s*'([^']+)'`));
    if (!match) {
      throw new Error(`locales/de/homepage.js has no string literal for "${key}"`);
    }
    return match[1];
  };
  return {
    suddenlyIll: pick('suddenlyIll'),
    emergencyConsultation: pick('emergencyConsultation'),
    akutNoticeHours: pick('akutNoticeHours'),
    akutNoticePhone: pick('akutNoticePhone'),
  };
}

function run() {
  const {
    suddenlyIll,
    emergencyConsultation,
    akutNoticeHours,
    akutNoticePhone,
  } = loadLocaleStrings();

  let failures = 0;
  const check = (label, condition) => {
    if (condition) {
      console.log(`  ok - ${label}`);
    } else {
      failures += 1;
      console.error(`  FAIL - ${label}`);
    }
  };

  // Criterion 1: no walk-in invitation left.
  check(
    'suddenlyIll no longer contains the walk-in invite ("Gerne dürfen Sie ... kommen")',
    !suddenlyIll.includes('Gerne dürfen Sie'),
  );
  check(
    'suddenlyIll no longer contains the daily-cadence phrase ("täglich stattfindende")',
    !suddenlyIll.includes('täglich stattfindende'),
  );

  // Criterion 2: the appointment-only sentence, practice-confirmed wording (either variant).
  const printVariant =
    'Eine direkte Vorstellung in der Praxis ohne Termin ist dann nicht mehr möglich.';
  const chatVariant = 'Eine direkte Vorstellung ohne Termin ist dann nicht mehr möglich.';
  check(
    'suddenlyIll states the appointment-only sentence verbatim (print or chat-message variant)',
    suddenlyIll.includes(printVariant) || suddenlyIll.includes(chatVariant),
  );

  // Criterion 3: call-to-phone block, same facts as the notice, no Doctolib.
  check(
    'suddenlyIll carries the same opening-hours text as the notice (akutNoticeHours)',
    suddenlyIll.includes(akutNoticeHours),
  );
  check(
    'suddenlyIll carries the same phone number as the notice (0211-285009)',
    suddenlyIll.includes('0211-285009') && akutNoticePhone.includes('0211-285009'),
  );
  check(
    'suddenlyIll does not mention Doctolib',
    !/doctolib/i.test(suddenlyIll),
  );

  // Criterion 4: the card title stays as-is.
  check(
    'emergencyConsultation stays "Notfallsprechstunde"',
    emergencyConsultation === 'Notfallsprechstunde',
  );

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll assertions passed.');
}

try {
  run();
} catch (err) {
  console.error(`FAIL - ${err.message}`);
  process.exit(1);
}
