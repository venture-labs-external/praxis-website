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

// Section roots: id="news", id="services", id="about-us", id="team", id="contact"
const SECTION_IDS = ['news', 'services', 'about-us', 'team', 'contact'];

/**
 * The opening tag of the element carrying `id="<id>"`. Fails rather than
 * returning nothing when the root moved or changed shape — a missing match must
 * not turn the caller's assertion into a no-op.
 */
function sectionRootTag(id) {
  // `(?<![-\w])` so `data-id="news"` is not mistaken for the `id` attribute.
  const match = html.match(
    new RegExp(`<[a-z]+\\s[^>]*(?<![-\\w])id=["']${id}["'][^>]*>`, 'i'),
  );
  assert(
    match,
    `Section root not found: id="${id}" — the test can assert nothing about it`,
  );
  return match[0];
}

test('Criterion 6.2: No section root carries inline opacity:0', (_t) => {
  for (const id of SECTION_IDS) {
    const tag = sectionRootTag(id);
    assert(
      !tag.includes('opacity:0') && !tag.includes('opacity: 0'),
      `Section id="${id}" has inline opacity:0`,
    );
  }
});

test('Criterion 6.3: No section root carries inline visibility:hidden', (_t) => {
  for (const id of SECTION_IDS) {
    const tag = sectionRootTag(id);
    assert(
      !tag.includes('visibility:hidden') && !tag.includes('visibility: hidden'),
      `Section id="${id}" has inline visibility:hidden`,
    );
  }
});

// ============================================================================
// Criterion 7: CSS defines the reveal rules
// ============================================================================

// `build.extractCSS` is false, so the stylesheet ships inlined in a <style> tag
// in dist/index.html rather than as a file under dist/_nuxt/. Read it from
// wherever it is, and assert on the rule *bodies* — a file-wide substring search
// passes on any page that happens to contain `opacity:0` somewhere else.

const REDUCED_MOTION_BLOCK =
  /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/;

const NUXT_DIR = path.join(DIST_DIR, '_nuxt');

function readNuxtFiles(extension) {
  return fs
    .readdirSync(NUXT_DIR)
    .filter((name) => name.endsWith(extension))
    .map((name) => ({
      name,
      source: fs.readFileSync(path.join(NUXT_DIR, name), 'utf-8'),
    }));
}

const distCss = [html]
  .concat(readNuxtFiles('.css').map((file) => file.source))
  .join('\n');

const reducedMotionMatch = distCss.match(REDUCED_MOTION_BLOCK);
// Everything outside the reduced-motion block, so the two base rules below are
// read from the base cascade and not accidentally from the override.
const baseCss = distCss.replace(REDUCED_MOTION_BLOCK, '');

/** Declarations of the first rule whose selector is exactly `selector`. */
function ruleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert(match, `CSS rule not found: ${selector}`);
  return match[1].replace(/\s+/g, '');
}

test('Criterion 7.1: .reveal--pending hides with a transition', (_t) => {
  const body = ruleBody(baseCss, '.reveal--pending');

  assert.match(
    body,
    /opacity:0[;}]?/,
    `.reveal--pending lacks opacity:0 — {${body}}`,
  );
  assert.match(
    body,
    /transform:translateY\(/,
    `.reveal--pending lacks a translateY offset — {${body}}`,
  );
  assert.match(
    body,
    /transition:[^;]*opacity/,
    `.reveal--pending does not transition opacity — {${body}}`,
  );
  assert.match(
    body,
    /transition:[^;]*transform/,
    `.reveal--pending does not transition transform — {${body}}`,
  );
});

test('Criterion 7.2: .reveal--pending.reveal--in restores the section', (_t) => {
  const body = ruleBody(baseCss, '.reveal--pending.reveal--in');

  assert.match(
    body,
    /opacity:1/,
    `revealed state does not restore opacity:1 — {${body}}`,
  );
  assert.match(
    body,
    /transform:none/,
    `revealed state does not reset transform to none — {${body}}`,
  );
});

test('Criterion 7.3: prefers-reduced-motion neutralises both classes', (_t) => {
  assert(
    reducedMotionMatch,
    'Missing @media (prefers-reduced-motion: reduce) block',
  );

  const block = reducedMotionMatch[1];
  const rules = block.match(/[^{}]+\{[^{}]*\}/g) || [];
  const revealRule = rules.find((rule) => rule.includes('.reveal--pending'));

  assert(
    revealRule,
    `The reduced-motion block has no .reveal--pending rule — {${block}}`,
  );

  const [selector, declarations] = revealRule.split('{');
  const selectors = selector.split(',').map((s) => s.trim());
  const body = declarations.replace(/[}\s]/g, '');

  assert(
    selectors.includes('.reveal--pending'),
    `The reduced-motion rule does not cover .reveal--pending — ${selector}`,
  );
  assert(
    selectors.includes('.reveal--pending.reveal--in'),
    `The reduced-motion rule does not cover .reveal--pending.reveal--in — ${selector}`,
  );
  assert.match(
    body,
    /opacity:1/,
    `reduced motion does not restore opacity — {${body}}`,
  );
  assert.match(
    body,
    /transform:none/,
    `reduced motion does not reset transform — {${body}}`,
  );
  assert.match(
    body,
    /transition:none/,
    `reduced motion does not drop the transition — {${body}}`,
  );
});

// ============================================================================
// Criterion 20: No localhost:3000 in fetched resources
// ============================================================================

// The string lives in the JS bundle, not in the HTML, so this reads
// dist/index.html *and* every dist/_nuxt/*.js. Two occurrences are known dead
// configuration defaults, both in the shape `baseUrl|baseURL: "http://localhost:3000"`:
// Nuxt's `env.baseUrl` context constant, and @nuxtjs/axios's fallback `baseURL`
// (nothing in the app calls axios). Anything else — a different count, or an
// occurrence at a fetch/XHR call site — is a real localhost request and fails.

const LOCALHOST_URL = 'http://localhost:3000';
const KNOWN_DEAD_OCCURRENCES = 2;

// The occurrence is preceded by the config key it is the default for.
const DEAD_CONFIG_DEFAULT = /(?:baseUrl|baseURL)["']?\s*(?::|\|\||=)\s*["'`]$/;

// The occurrence is the URL argument of a request being made.
const CALL_SITE_PATTERNS = [
  { name: 'fetch()', pattern: /fetch\s*\(\s*["'`]$/ },
  { name: 'XHR open()', pattern: /\.open\s*\(\s*["'`]\w+["'`]\s*,\s*["'`]$/ },
  {
    name: 'http method call',
    pattern: /\.(?:get|post|put|patch|delete|head|request)\s*\(\s*["'`]$/,
  },
];

function findLocalhostOccurrences() {
  const sources = [{ name: 'index.html', source: html }].concat(
    readNuxtFiles('.js'),
  );
  const occurrences = [];

  for (const file of sources) {
    let index = file.source.indexOf(LOCALHOST_URL);
    while (index !== -1) {
      occurrences.push({
        file: file.name,
        prefix: file.source.slice(Math.max(0, index - 80), index),
        context: file.source.slice(Math.max(0, index - 80), index + 40),
      });
      index = file.source.indexOf(LOCALHOST_URL, index + 1);
    }
  }

  return occurrences;
}

test('Criterion 20: no localhost:3000 is requested at runtime', (_t) => {
  const occurrences = findLocalhostOccurrences();

  const callSites = [];
  const unclassified = [];

  for (const occurrence of occurrences) {
    const callSite = CALL_SITE_PATTERNS.find((candidate) =>
      candidate.pattern.test(occurrence.prefix),
    );
    if (callSite) {
      callSites.push(
        `${occurrence.file} (${callSite.name}): ${occurrence.context}`,
      );
    } else if (!DEAD_CONFIG_DEFAULT.test(occurrence.prefix)) {
      unclassified.push(`${occurrence.file}: ${occurrence.context}`);
    }
  }

  assert.strictEqual(
    callSites.length,
    0,
    `${LOCALHOST_URL} is requested at runtime:\n  ${callSites.join('\n  ')}`,
  );

  assert.strictEqual(
    unclassified.length,
    0,
    `${LOCALHOST_URL} occurs somewhere other than a known-dead config default:\n  ` +
      unclassified.join('\n  '),
  );

  // Records the dead occurrences and passes, as the spec's row 20 allows — but
  // pinned, so a newly wired call that lands in one of these files is a failure.
  assert.strictEqual(
    occurrences.length,
    KNOWN_DEAD_OCCURRENCES,
    `Expected exactly ${KNOWN_DEAD_OCCURRENCES} dead ${LOCALHOST_URL} constants ` +
      `(env.baseUrl and the axios baseURL default), found ${occurrences.length}:\n  ` +
      occurrences.map((o) => `${o.file}: ${o.context}`).join('\n  '),
  );

  console.log(
    `  ℹ  ${occurrences.length} dead ${LOCALHOST_URL} constants, none requested: ` +
      occurrences.map((o) => o.file).join(', '),
  );
});

// ============================================================================
// Summary
// ============================================================================

test('Summary: Generated dist/ is valid', (_t) => {
  const stats = fs.statSync(INDEX_HTML);
  console.log(`  ✓ dist/index.html is ${stats.size} bytes`);
  assert(stats.size > 100000, 'dist/index.html is suspiciously small');
});
