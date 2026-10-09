#!/usr/bin/env node
// Visual parity: judges this branch's static export against the `dev`
// branch's static export (the pre-migration site, still Nuxt 2/Vue 2/
// Vuetify 2) - the yardstick the task's spec asks for. Documented command:
// see README.md ("Visual parity" section).
//
// `--skip-build` reuses whatever is already at `.cache/old/dist` and the
// repo's own `dist/` (for fast local iteration only - the real run always
// builds both fresh).
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

import { loadAllowlist, partitionByAllowlist } from './lib/allowlist.mjs';
import { diffSnapshots } from './lib/diff.mjs';
import { buildStaticExport } from './lib/docker-build.mjs';
import { archiveBranch } from './lib/git-archive.mjs';
import { diffScreenshots } from './lib/screenshot-diff.mjs';
import { collectSnapshot } from './lib/snapshot.mjs';
import { STATES } from './lib/states.mjs';
import { listen } from './lib/static-server.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..', '..');
const outputDir = join(__dirname, 'output');
const reportPath = join(repoRoot, 'docs', 'visual-parity', 'report.md');
const allowlistPath = join(__dirname, 'allowlist.json');

const WIDTHS = [390, 768, 1440];
const PAGE_HEIGHT_TOLERANCE_PX = 2;
const SCREENSHOT_DIFF_THRESHOLD_PCT = 0.5;

const skipBuild = process.argv.includes('--skip-build');

async function main() {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(dirname(reportPath), { recursive: true });

  let oldDist;
  let newDist;
  if (skipBuild) {
    oldDist = join(outputDir, 'old-src', 'dist');
    newDist = join(repoRoot, 'dist');
    console.log('[visual-parity] --skip-build: reusing existing dist/ output');
  } else {
    const oldSrc = mkdtempSync(join(tmpdir(), 'visual-parity-old-'));
    console.log(`[visual-parity] archiving dev branch into ${oldSrc}`);
    await archiveBranch(repoRoot, 'dev', oldSrc);
    oldDist = await buildStaticExport(oldSrc, {
      label: 'old (dev branch, Node 14)',
    });
    newDist = await buildStaticExport(repoRoot, { label: 'new (this branch)' });
  }

  const oldServer = await listen(oldDist, 0);
  const newServer = await listen(newDist, 0);
  const oldPort = oldServer.address().port;
  const newPort = newServer.address().port;
  console.log(`[visual-parity] serving old on :${oldPort}, new on :${newPort}`);

  const browser = await chromium.launch();
  const allDifferences = [];
  const screenshots = [];
  const pageHeights = [];

  try {
    for (const width of WIDTHS) {
      for (const state of STATES) {
        if (!state.applicableAt(width)) continue;

        const oldPage = await browser.newPage({
          viewport: { width, height: 900 },
        });
        const newPage = await browser.newPage({
          viewport: { width, height: 900 },
        });
        try {
          await oldPage.goto(`http://127.0.0.1:${oldPort}/`, {
            waitUntil: 'load',
          });
          await newPage.goto(`http://127.0.0.1:${newPort}/`, {
            waitUntil: 'load',
          });
          await state.apply(oldPage);
          await state.apply(newPage);

          const oldSnap = await oldPage.evaluate(collectSnapshot);
          const newSnap = await newPage.evaluate(collectSnapshot);
          const { differences, pageHeightDiff, oldPageHeight, newPageHeight } =
            diffSnapshots(oldSnap, newSnap, {
              width,
              state: state.name,
              lang: 'de',
            });
          allDifferences.push(...differences);
          if (state.name === 'default') {
            pageHeights.push({
              width,
              oldPageHeight,
              newPageHeight,
              pageHeightDiff,
            });

            const oldShot = await oldPage.screenshot({ fullPage: true });
            const newShot = await newPage.screenshot({ fullPage: true });
            const diffResult = diffScreenshots(oldShot, newShot);
            const diffPath = join(outputDir, `diff-${width}.png`);
            writeFileSync(diffPath, diffResult.diffPng);
            writeFileSync(join(outputDir, `old-${width}.png`), oldShot);
            writeFileSync(join(outputDir, `new-${width}.png`), newShot);
            screenshots.push({ width, ...diffResult, diffPath });
          }
        } finally {
          await oldPage.close();
          await newPage.close();
        }
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => oldServer.close(resolve));
    await new Promise((resolve) => newServer.close(resolve));
  }

  const allowlist = loadAllowlist(allowlistPath);
  const { allowed, blocking } = partitionByAllowlist(allDifferences, allowlist);

  writeFileSync(
    join(outputDir, 'results.json'),
    JSON.stringify(
      {
        allDifferences,
        allowed,
        blocking,
        pageHeights,
        screenshots: screenshots.map(({ diffPng: _diffPng, ...rest }) => rest),
      },
      null,
      2,
    ),
  );

  const report = renderReport({
    allDifferences,
    allowed,
    blocking,
    pageHeights,
    screenshots,
    allowlist,
  });
  writeFileSync(reportPath, report);
  console.log(`[visual-parity] report written to ${reportPath}`);

  const screenshotFailures = screenshots.filter(
    (s) => s.percentage >= SCREENSHOT_DIFF_THRESHOLD_PCT,
  );
  const pageHeightFailures = pageHeights.filter(
    (p) => p.pageHeightDiff > PAGE_HEIGHT_TOLERANCE_PX,
  );

  console.log(
    `[visual-parity] ${blocking.length} blocking difference(s), ${allowed.length} allow-listed, ${screenshotFailures.length} width(s) over the ${SCREENSHOT_DIFF_THRESHOLD_PCT}% screenshot threshold, ${pageHeightFailures.length} width(s) over the ${PAGE_HEIGHT_TOLERANCE_PX}px page-height tolerance.`,
  );

  if (
    blocking.length > 0 ||
    screenshotFailures.length > 0 ||
    pageHeightFailures.length > 0
  ) {
    process.exit(1);
  }
}

function renderReport({
  allDifferences,
  allowed,
  blocking,
  pageHeights,
  screenshots,
  allowlist,
}) {
  const lines = [];
  lines.push('# Visual parity report');
  lines.push('');
  lines.push(
    `Compares this branch's static export (new: Nuxt 4/Vue 3/Vuetify 3) against the \`dev\` branch's static export (old: Nuxt 2/Vue 2/Vuetify 2, the pre-migration site), built fresh each run in the Node version each tree's own \`.nvmrc\` names. German only (locales/en holds the same German strings under English keys, VL-8-D14 - nothing to compare in a second language). Generated by \`tools/visual-parity/run.mjs\` on ${new Date().toISOString()}.`,
  );
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(
    `- Total differences found (before the allow list): **${allDifferences.length}**`,
  );
  lines.push(
    `- Allow-listed (intended, each with a reason below): **${allowed.length}**`,
  );
  lines.push(
    `- Blocking (acceptance criterion 2/3 failures): **${blocking.length}**`,
  );
  lines.push('');
  lines.push(
    "Before this task's fix (the state the review found - Christian Wenzel, 2026-10-09): a manual check of the first 45 text elements at 1440px found 39 of 45 different, traced to Vuetify 3 compiling with its own default typography instead of this repo's override (`assets/variables.scss` never actually reached Vuetify's settings module - see the fix commit's message). The count above is this script's own, full, automated count across all three widths and every state, after that fix.",
  );
  lines.push('');
  lines.push('## Page height');
  lines.push('');
  lines.push('| Width | Old (dev) | New (this branch) | Diff |');
  lines.push('|---|---|---|---|');
  for (const p of pageHeights) {
    lines.push(
      `| ${p.width}px | ${p.oldPageHeight}px | ${p.newPageHeight}px | ${p.pageHeightDiff}px |`,
    );
  }
  lines.push('');
  lines.push('## Screenshot pixel difference');
  lines.push('');
  lines.push('| Width | Mismatched px | % of image | Old | New | Diff |');
  lines.push('|---|---|---|---|---|---|');
  for (const s of screenshots) {
    const rel = (name) =>
      `../../tools/visual-parity/output/${name}-${s.width}.png`;
    lines.push(
      `| ${s.width}px | ${s.mismatchedPixels} | ${s.percentage.toFixed(3)}% | [old](${rel('old')}) | [new](${rel('new')}) | [diff](${rel('diff')}) |`,
    );
  }
  lines.push('');
  lines.push('## Blocking differences');
  lines.push('');
  if (blocking.length === 0) {
    lines.push('None.');
  } else {
    lines.push('| Width | State | Tag | Text | Kind | Property | Old | New |');
    lines.push('|---|---|---|---|---|---|---|---|');
    for (const d of blocking.slice(0, 500)) {
      lines.push(
        `| ${d.width} | ${d.state} | ${d.tag} | ${String(d.text).slice(0, 40).replace(/\|/g, '\\|')} | ${d.kind} | ${d.property ?? d.detail ?? ''} | ${d.old ?? ''} | ${d.new ?? ''} |`,
      );
    }
    if (blocking.length > 500)
      lines.push(
        `| … | ${blocking.length - 500} more rows not shown … | | | | | | |`,
      );
  }
  lines.push('');
  lines.push('## Allow list');
  lines.push('');
  if (allowlist.length === 0) {
    lines.push('Empty - no intended difference.');
  } else {
    for (const entry of allowlist) {
      lines.push(`- ${JSON.stringify(entry)}`);
    }
  }
  lines.push('');
  lines.push('## Lighthouse');
  lines.push('');
  lines.push(
    'Not run by this script (no network egress to a Lighthouse CLI dependency was added for a dev-tooling script that already needs Docker + Playwright). Run `npx lighthouse http://127.0.0.1:<port>/ --view` manually against each served `dist/` if a number is needed for the PR description; `lighthouserc.js` already exists in the repo root from before this task.',
  );
  lines.push('');
  return lines.join('\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
