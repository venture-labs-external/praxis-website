#!/usr/bin/env node
// Visual parity: judges this branch's static export against the old site -
// branch `main` by default (equal to the live site; configurable via
// `--baseline=<ref>`, refuses `dev` - see below), or the live site itself
// directly via `--live`. The pre-migration site is still Nuxt 2/Vue 2/
// Vuetify 2 - the yardstick the task's spec asks for. Documented command:
// see README.md ("Visual parity" section).
//
// 20261009-praxis-gerresheim-last-differences-to-the-live-s: the baseline
// used to be hard-coded to `dev`, which was correct only while `dev` was
// still the pre-migration site. VL-8-S1 merged the migrated site into `dev`
// itself (PR #50, 2026-10-09 09:14), so a `dev` baseline would from then on
// compare the new build against itself - `main` (untouched, equal to live)
// is the real old site and is now the default; `--baseline=dev` is refused.
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
import { archiveBranch, resolveCommit } from './lib/git-archive.mjs';
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
const LIVE_URL = 'https://www.frauenaerztinnen-gerresheim.de';

const skipBuild = process.argv.includes('--skip-build');
const liveBaseline = process.argv.includes('--live');
const baselineArg = process.argv.find((a) => a.startsWith('--baseline='));
// The old site is `main` (equal to the live site) - never `dev`, which has
// been the migrated (new) site itself since VL-8-S1 merged (PR #50,
// 2026-10-09 09:14). A run accidentally pointed at `dev` would compare the
// new build against itself and silently report "0 differences" - refused
// outright rather than produced as a misleading report.
const baseline = baselineArg ? baselineArg.slice('--baseline='.length) : 'main';
if (baseline === 'dev') {
  console.error(
    '[visual-parity] refusing --baseline=dev: the old site is `main` (or --live), never `dev` - `dev` has been the migrated site itself since VL-8-S1.',
  );
  process.exit(1);
}
if (liveBaseline && baselineArg) {
  console.error(
    '[visual-parity] pass either --baseline=<ref> or --live, not both',
  );
  process.exit(1);
}

/**
 * Forces every `<img loading="lazy">` on the page (the Team/AboutUs doctor
 * photos, none of which has an explicit `width`/`height`, so each is 0-
 * height until it loads) to start fetching immediately, then waits for all
 * of them to finish loading or error out - resolves either way, never
 * hangs on a genuinely broken image.
 *
 * Native lazy loading's own "near the viewport" distance is a browser
 * heuristic (it can factor in the estimated connection speed), not a fixed
 * number - relying on it gave inconsistent results run to run (confirmed:
 * one `compare` run had every doctor photo settled in time except the
 * *last* team member's, shifting every element below it by exactly one
 * photo's own height on one side only; a later run had a different one
 * unsettled). Forcing every image eager up front removes that variability
 * instead of chasing which specific image a given run happens to still be
 * loading.
 */
async function waitForImages(page) {
  await page.evaluate(() =>
    Promise.all(
      [...document.images].map((img) => {
        if (img.loading === 'lazy') img.loading = 'eager';
        return img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            });
      }),
    ),
  );
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  mkdirSync(dirname(reportPath), { recursive: true });

  let oldBaseUrl;
  let newDist;
  let oldServer;
  let oldCommit;
  const newCommit = await resolveCommit(repoRoot, 'HEAD');

  if (liveBaseline) {
    oldBaseUrl = LIVE_URL;
    oldCommit = 'live';
    newDist = skipBuild
      ? join(repoRoot, 'dist')
      : await buildStaticExport(repoRoot, { label: 'new (this branch)' });
  } else if (skipBuild) {
    const oldDist = join(outputDir, 'old-src', 'dist');
    newDist = join(repoRoot, 'dist');
    oldServer = await listen(oldDist, 0);
    oldBaseUrl = `http://127.0.0.1:${oldServer.address().port}`;
    oldCommit = await resolveCommit(repoRoot, baseline);
    console.log('[visual-parity] --skip-build: reusing existing dist/ output');
  } else {
    const oldSrc = mkdtempSync(join(tmpdir(), 'visual-parity-old-'));
    console.log(`[visual-parity] archiving ${baseline} branch into ${oldSrc}`);
    await archiveBranch(repoRoot, baseline, oldSrc);
    oldCommit = await resolveCommit(repoRoot, baseline);
    const oldDist = await buildStaticExport(oldSrc, {
      label: `old (${baseline} branch, Node 14)`,
    });
    newDist = await buildStaticExport(repoRoot, { label: 'new (this branch)' });
    oldServer = await listen(oldDist, 0);
    oldBaseUrl = `http://127.0.0.1:${oldServer.address().port}`;
  }

  const newServer = await listen(newDist, 0);
  const newPort = newServer.address().port;
  console.log(
    `[visual-parity] serving old on ${oldBaseUrl} (commit ${oldCommit}), new on :${newPort} (commit ${newCommit})`,
  );

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
          await oldPage.goto(`${oldBaseUrl}/`, {
            waitUntil: 'load',
          });
          await newPage.goto(`http://127.0.0.1:${newPort}/`, {
            waitUntil: 'load',
          });
          // Force every doctor photo to load right away rather than once
          // (if ever) native lazy loading's own viewport-distance heuristic
          // decides to - see `waitForImages`'s own comment.
          await waitForImages(oldPage);
          await waitForImages(newPage);
          // Wait for every @font-face to finish loading before measuring
          // anything: text set in a custom font (Roboto/Roboto Serif) wraps
          // differently with the fallback it briefly renders with first
          // (font-display: swap), and the two builds' bundles are different
          // sizes, so they do not swap at exactly the same moment - without
          // this, wrapped-line-count differences show up as pure noise.
          // `document.fonts.ready` resolving does not guarantee the reflow
          // that actually uses the newly-loaded font has been painted yet
          // (confirmed: an occasional ~700px page-height difference at
          // 390px, "default" state, every other width/state identical -
          // the one-frame-stale layout still measuring the fallback font's
          // wrap) - two animation frames past it is enough margin for that
          // reflow to have happened.
          await oldPage.evaluate(
            () =>
              new Promise((resolve) => {
                document.fonts.ready.then(() =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                );
              }),
          );
          await newPage.evaluate(
            () =>
              new Promise((resolve) => {
                document.fonts.ready.then(() =>
                  requestAnimationFrame(() => requestAnimationFrame(resolve)),
                );
              }),
          );
          await state.apply(oldPage);
          await state.apply(newPage);
          // Already forced+awaited once right after `goto` above - a cheap
          // re-check, in case a state's own interaction (there is none
          // today) ever adds a new image to the page.
          await waitForImages(oldPage);
          await waitForImages(newPage);

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
    if (oldServer) await new Promise((resolve) => oldServer.close(resolve));
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
    oldLabel: liveBaseline ? 'live' : baseline,
    oldCommit,
    newCommit,
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
  oldLabel,
  oldCommit,
  newCommit,
}) {
  const lines = [];
  lines.push('# Visual parity report');
  lines.push('');
  lines.push(
    `Compares this branch's static export (new: Nuxt 4/Vue 3/Vuetify 3, commit \`${newCommit}\`) against the \`${oldLabel}\` static export (old: Nuxt 2/Vue 2/Vuetify 2, the pre-migration site, commit \`${oldCommit}\`${oldLabel === 'live' ? ` - served directly from ${LIVE_URL}` : ''}), built fresh each run in the Node version each tree's own \`.nvmrc\` names (the live baseline is served directly, nothing is built for it). German only (locales/en holds the same German strings under English keys, VL-8-D14 - nothing to compare in a second language). Generated by \`tools/visual-parity/run.mjs\` on ${new Date().toISOString()}.`,
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
  lines.push(`| Width | Old (${oldLabel}) | New (this branch) | Diff |`);
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
