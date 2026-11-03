// VL-32-S2 criteria 17 and 18: the generated page head carries og:* as `property` metas with an
// absolute og:image, one twitter:card and one theme-color, and the manifest is the practice's own.
//
// Plain Node script (no test runner in this repo), run directly after the repo's own build:
//   node test/head-baseline.test.js
// It reads dist/index.html (run `yarn generate` first) and public/manifest.webmanifest.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public', 'manifest.webmanifest'), 'utf8'),
);

const metas = html.match(/<meta [^>]*>/g) || [];
const withAttr = (attr, value) =>
  metas.filter((m) => new RegExp(`\\b${attr}="${value}"`).test(m));
const contentOf = (tag) => (tag.match(/\bcontent="([^"]*)"/) || [])[1];

for (const key of ['og:title', 'og:description', 'og:image']) {
  const tags = withAttr('property', key);
  assert.equal(tags.length, 1, `exactly one property="${key}" meta`);
  assert.ok(contentOf(tags[0]), `property="${key}" has content`);
  assert.equal(
    withAttr('name', key).length,
    0,
    `${key} is not also written as a name meta`,
  );
}
assert.match(
  contentOf(withAttr('property', 'og:image')[0]),
  /^https:\/\//,
  'og:image is an absolute https URL',
);
assert.equal(withAttr('name', 'twitter:card').length, 1, 'one twitter:card');
assert.equal(withAttr('name', 'theme-color').length, 1, 'one theme-color');
assert.equal(
  contentOf(withAttr('name', 'theme-color')[0]),
  manifest.theme_color,
);

const manifestText = JSON.stringify(manifest);
assert.ok(!/vue-website-template/i.test(manifestText), 'no template strings');
assert.match(manifest.name, /Gerresheim/);
assert.equal(manifest.lang, 'de');
assert.ok(manifest.theme_color, 'manifest has theme_color');
for (const icon of manifest.icons) {
  assert.ok(
    fs.existsSync(path.join(ROOT, 'public', icon.src)),
    `icon file exists: ${icon.src}`,
  );
}

console.log('head-baseline: ok');
