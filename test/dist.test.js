/**
 * Assertions on the generated dist/ output.
 *
 * Prerequisite: NODE_OPTIONS=--openssl-legacy-provider yarn generate
 *
 * Tests that the static export includes all sections, their copy, all image
 * paths, the maps iframe, and that no section's visibility depends on JS.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Ensure dist/ exists; if not, fail with a clear message
if (!fs.existsSync(DIST_DIR)) {
  console.error(
    `ERROR: ${DIST_DIR} not found. Run this command first:\n` +
      `  NODE_OPTIONS=--openssl-legacy-provider yarn generate\n`,
  );
  process.exit(1);
}

if (!fs.existsSync(INDEX_HTML)) {
  console.error(
    `ERROR: ${INDEX_HTML} not found. Run this command first:\n` +
      `  NODE_OPTIONS=--openssl-legacy-provider yarn generate\n`,
  );
  process.exit(1);
}

let html = '';
try {
  html = fs.readFileSync(INDEX_HTML, 'utf-8');
} catch (err) {
  console.error(`ERROR reading ${INDEX_HTML}: ${err.message}`);
  process.exit(1);
}

// ============================================================================
// Criterion 2: dist/index.html contains the pre-rendered markup of all six
// sections with German copy
// ============================================================================

test('Criterion 2.1: dist/index.html contains a header element', (_t) => {
  assert.match(html, /<header/i, 'Missing <header element');
});

test('Criterion 2.2: dist/index.html contains id="news"', (_t) => {
  assert.match(html, /id="news"/, 'Missing id="news"');
});

test('Criterion 2.3: dist/index.html contains id="services"', (_t) => {
  assert.match(html, /id="services"/, 'Missing id="services"');
});

test('Criterion 2.4: dist/index.html contains id="about-us"', (_t) => {
  assert.match(html, /id="about-us"/, 'Missing id="about-us"');
});

test('Criterion 2.5: dist/index.html contains id="team"', (_t) => {
  assert.match(html, /id="team"/, 'Missing id="team"');
});

test('Criterion 2.6: dist/index.html contains id="contact"', (_t) => {
  assert.match(html, /id="contact"/, 'Missing id="contact"');
});

test('Criterion 2.7: German copy "Wo Sie uns finden" is present', (_t) => {
  assert.match(
    html,
    /Wo Sie uns finden/,
    'Missing German copy: Wo Sie uns finden',
  );
});

test('Criterion 2.8: German copy "Das Praxisteam" is present', (_t) => {
  assert.match(html, /Das Praxisteam/, 'Missing German copy: Das Praxisteam');
});

test('Criterion 2.9: German copy "Herzlich willkommen" is present', (_t) => {
  assert.match(
    html,
    /Herzlich willkommen/,
    'Missing German copy: Herzlich willkommen',
  );
});

// ============================================================================
// Criterion 3: Every local image path exists under dist/
// ============================================================================

test('Criterion 3: Every src and srcset path exists in dist/', (_t) => {
  const srcRegex = /(?:src|srcset)=["']([^"']+)["']/g;
  const matches = html.matchAll(srcRegex);

  let imageCount = 0;
  const missing = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const match of matches) {
    const paths = match[1]
      .split(',')
      .map((p) => p.trim())
      .map((p) => {
        // Each srcset entry is "path Nw"; extract the path
        const parts = p.split(/\s+/);
        return parts[0];
      });

    for (const filePath of paths) {
      // Skip absolute URLs, tel:, mailto:, and data URIs
      if (
        filePath.startsWith('http') ||
        filePath.startsWith('//') ||
        filePath.startsWith('tel:') ||
        filePath.startsWith('mailto:') ||
        filePath.startsWith('data:')
      ) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Convert leading slash paths to relative (static files are served from dist/)
      const relativePath = filePath.startsWith('/')
        ? filePath.slice(1)
        : filePath;
      const fullPath = path.join(DIST_DIR, relativePath);

      imageCount++;
      if (!fs.existsSync(fullPath)) {
        missing.push(`${filePath} (resolved to ${fullPath})`);
      }
    }
  }

  assert.strictEqual(
    missing.length,
    0,
    `${missing.length} image paths missing in dist/: ${missing.join('; ')}`,
  );
  assert(imageCount > 0, 'No image paths found in HTML');
  console.log(`  ✓ ${imageCount} image paths checked and present`);
});

// ============================================================================
// Criterion 4: Google Maps iframe is present
// ============================================================================

test('Criterion 4: Google Maps iframe src starts with https://www.google.com/maps/embed?pb=', (_t) => {
  const mapsRegex = /src=["']([^"']*google\.com\/maps\/embed\?pb=[^"']*)["']/;
  const match = html.match(mapsRegex);

  assert(
    match,
    'Google Maps iframe not found or src does not match expected pattern',
  );
  assert.match(match[1], /^https:\/\/www\.google\.com\/maps\/embed\?pb=/);
});

// ============================================================================
// Criterion 6: No section's visibility depends on JavaScript
// ============================================================================

test('Criterion 6.1: dist/index.html contains no reveal--pending class on elements', (_t) => {
  // The string "reveal--pending" may appear in the inline stylesheet,
  // but it must not appear in any class attribute
  const classMatches = html.match(/class="[^"]*reveal--pending[^"]*"/g);

  assert(!classMatches, 'Found reveal--pending in class attribute');
});

test('Criterion 6.2: No section root carries inline opacity:0', (_t) => {
  // Section roots: id="news", id="services", id="about-us", id="team", id="contact"
  const sectionIds = ['news', 'services', 'about-us', 'team', 'contact'];

  for (const id of sectionIds) {
    const sectionMatch = html.match(
      new RegExp(`<[a-z]+ [^>]*id=["']${id}["'][^>]*>`, 'i'),
    );
    if (sectionMatch) {
      assert(
        !sectionMatch[0].includes('opacity:0') &&
          !sectionMatch[0].includes('opacity: 0'),
        `Section id="${id}" has inline opacity:0`,
      );
    }
  }
});

test('Criterion 6.3: No section root carries inline visibility:hidden', (_t) => {
  const sectionIds = ['news', 'services', 'about-us', 'team', 'contact'];

  for (const id of sectionIds) {
    const sectionMatch = html.match(
      new RegExp(`<[a-z]+ [^>]*id=["']${id}["'][^>]*>`, 'i'),
    );
    if (sectionMatch) {
      assert(
        !sectionMatch[0].includes('visibility:hidden') &&
          !sectionMatch[0].includes('visibility: hidden'),
        `Section id="${id}" has inline visibility:hidden`,
      );
    }
  }
});

// ============================================================================
// Criterion 7: CSS defines the reveal rules
// ============================================================================

test('Criterion 7.1: Reveal CSS rules are present in dist/index.html', (_t) => {
  // Since extractCSS is false, CSS is inlined in a <style> tag
  const hasRevealPending =
    html.includes('.reveal--pending') &&
    html.includes('opacity:0') &&
    html.includes('translateY');
  const hasRevealIn =
    html.includes('.reveal--pending.reveal--in') &&
    html.includes('opacity:1') &&
    html.includes('transform:none');
  const hasReducedMotion =
    html.includes('@media') && html.includes('prefers-reduced-motion');

  assert(
    hasRevealPending,
    'Missing .reveal--pending rule with opacity:0 and translateY',
  );
  assert(
    hasRevealIn,
    'Missing .reveal--pending.reveal--in rule with opacity:1 and transform:none',
  );
  assert(
    hasReducedMotion,
    'Missing @media (prefers-reduced-motion: reduce) block',
  );
});

// ============================================================================
// Criterion 20: No localhost:3000 in fetched resources
// ============================================================================

test('Criterion 20: No localhost:3000 runtime reference in dist/', (_t) => {
  // The dead string env.baseUrl may contain localhost:3000, but it should not be
  // in anything that is fetched at runtime (like in a fetch call or API URL).
  // For now, we just check that it doesn't appear in typical runtime places.

  // Common patterns to avoid:
  const forbiddenPatterns = [
    /fetch\s*\(\s*["'][^"']*localhost:3000/,
    /url:\s*["']http:\/\/localhost:3000/,
    /api\s*[:=]\s*["']http:\/\/localhost:3000/,
  ];

  let found = false;
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(html)) {
      found = true;
      break;
    }
  }

  // The literal string "localhost:3000" is acceptable if it's only in the dead constant,
  // but we don't have a perfect way to detect that without parsing the bundle.
  // For this test, we check that common fetch/API patterns don't contain it.
  assert(!found, 'Found localhost:3000 in potential runtime fetch/API call');

  // Log if the string is found at all, with a note
  if (html.includes('localhost:3000')) {
    console.log(
      '  ℹ  localhost:3000 found (likely dead env.baseUrl constant), test records and passes',
    );
  }
});

// ============================================================================
// Summary
// ============================================================================

test('Summary: Generated dist/ is valid', (_t) => {
  const stats = fs.statSync(INDEX_HTML);
  console.log(`  ✓ dist/index.html is ${stats.size} bytes`);
  assert(stats.size > 100000, 'dist/index.html is suspiciously small');
});
