#!/usr/bin/env node
// Acceptance criterion 5 of
// docs/specs/20261009-praxis-gerresheim-migrated-site-must-match-the-l.md:
// no component/layout/page `<style>` block may write a literal font-size,
// font-weight, line-height, letter-spacing, font-family, colour,
// border-radius, box-shadow colour or margin/padding/gap value - those live
// in assets/theme.js, assets/variables.scss and assets/_typography.scss
// only, named, and every component references them by name.
//
// Run as part of `yarn lint` (wired in package.json). Exits 1 and prints
// every offending `file:line` with the declaration on a violation.
import { readFileSync } from 'node:fs';
import { glob } from 'node:fs/promises';

const GUARDED_PROPS = new Set([
  'font',
  'font-size',
  'font-weight',
  'font-family',
  'line-height',
  'letter-spacing',
  'color',
  'background-color',
  'background',
  'border-radius',
  'box-shadow',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'gap',
  'column-gap',
  'row-gap',
]);

// Values that never need a name: the absence of a value, and the small set
// of CSS-wide/layout keywords this app's own `<style>` blocks already use
// next to a guarded property.
const SAFE_KEYWORDS = new Set([
  'auto',
  'none',
  'normal',
  'inherit',
  'unset',
  'initial',
  'transparent',
  'currentcolor',
  'pre-line',
  'solid',
  'bold',
  'italic',
]);

const STYLE_BLOCK_RE = /<style[^>]*>([\s\S]*?)<\/style>/gi;
const DECLARATION_RE = /([a-zA-Z-]+)\s*:\s*((?:[^;{}]|\n)+);/g;

// Blanks out `//` and `/* */` comment bodies but keeps every newline (so
// reported line numbers still line up), so a value mentioned in prose inside
// a comment (e.g. explaining a Vuetify-generated `color:#000!important`
// rule) is never mistaken for a real declaration.
function stripComments(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (m) => m.replace(/[^\n]/g, ' '));
}

function isLiteralToken(token) {
  if (token === '') return false;
  if (/^0(px|rem|em|%)?$/.test(token)) return false;
  if (SAFE_KEYWORDS.has(token.toLowerCase())) return false;
  if (/^#[0-9a-fA-F]{3,8}$/.test(token)) return true; // hex colour
  if (/^-?\d*\.?\d+(px|rem|em|vh|vw|%)?$/.test(token)) return true; // bare number/length
  if (/^rgba?\(/i.test(token)) return true; // literal rgb()/rgba() (not wrapped in var())
  return false;
}

function findViolations(value) {
  // Strip SCSS variable references and var()/map.get() calls - those are
  // exactly the theme references this check exists to require.
  const stripped = value
    .replace(/\$[a-zA-Z0-9_-]+/g, ' ')
    .replace(/var\([^)]*\)/g, ' ')
    .replace(/map(?:\.get|-get)\([^)]*\)/g, ' ')
    .replace(/rgb\(\s*\)/g, ' ')
    .replace(/!important/gi, ' ');
  const tokens = stripped.split(/[\s,]+/).filter(Boolean);
  return tokens.filter(isLiteralToken);
}

async function main() {
  const files = [];
  for await (const file of glob('{components,layouts,pages}/**/*.vue')) {
    files.push(file);
  }

  const violations = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    let styleMatch;
    while ((styleMatch = STYLE_BLOCK_RE.exec(source))) {
      const block = stripComments(styleMatch[1]);
      const blockStartLine = source
        .slice(0, styleMatch.index)
        .split('\n').length;
      let declMatch;
      while ((declMatch = DECLARATION_RE.exec(block))) {
        const [, rawProp, rawValue] = declMatch;
        const prop = rawProp.trim().toLowerCase();
        if (!GUARDED_PROPS.has(prop)) continue;
        const literals = findViolations(rawValue);
        if (literals.length > 0) {
          const line =
            blockStartLine +
            block.slice(0, declMatch.index).split('\n').length -
            1;
          violations.push({
            file,
            line,
            declaration: `${rawProp.trim()}: ${rawValue.trim()};`,
            literals,
          });
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error(
      `check-theme-literals: ${violations.length} literal font/spacing/colour value(s) outside the theme:\n`,
    );
    for (const v of violations) {
      console.error(
        `  ${v.file}:${v.line}  ${v.declaration}  (literal: ${v.literals.join(', ')})`,
      );
    }
    console.error(
      '\nMove each value into assets/variables.scss (or assets/theme.js) as a named variable and reference it here instead.',
    );
    process.exit(1);
  }

  console.log(
    `check-theme-literals: OK (${files.length} files checked, no literal found outside the theme)`,
  );
}

main();
