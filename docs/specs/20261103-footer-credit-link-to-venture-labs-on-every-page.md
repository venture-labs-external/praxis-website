---
task: 20261103-footer-credit-link-to-venture-labs-on-every-page
company: venturelabs
status: ready
size: S
branch: feature/footer-credit-link-to-venture-labs-on-every-page
base: dev
design: none
---

# Footer credit link "Umgesetzt von Venture Labs" on every page of the Praxis Gerresheim site

## Goal
Add one small credit line to the shared footer of frauenaerztinnen-gerresheim.de: the text "Umgesetzt von Venture Labs",
read from the locale files, as a normal followed link to `https://venturelabs.team`. It must be present in the built
HTML of every page the static export renders with the default layout, and look balanced on mobile (stacked footer) and
desktop (row footer). It may be merged into `dev`; it must not go live before Christian confirms that the practice
agrees (PR note "vor live: Zustimmung Praxis").
Complete on its own because the footer is shared and already renders on every page: the link works end to end once the PR is merged to `dev`, with no other slice, stub or flag.

## Assumptions
- Implements CONCEPT.md §S1 of VL-33 and its decisions D1-D6; the diff stays limited to `components/Footer.vue`, `locales/de/homepage.js` and `locales/en/homepage.js`.
- The code in this worktree is Nuxt 4 / Vue 3 / Vuetify 3 / `@nuxtjs/i18n` 10 (`package.json`, `nuxt.config.ts`, `<script setup>` in `Footer.vue`), `.nvmrc` is `24.21.0`. The brief's "Nuxt 2.15 / Node 14.21.3" is out of date (migration VL-8); I follow the code. `yarn generate` still writes the static export to `dist/` (`nitro.output.publicDir` in `nuxt.config.ts`).
- Key name: `homepage.creditVentureLabs` with the value `Umgesetzt von Venture Labs` in BOTH `locales/de/homepage.js` and `locales/en/homepage.js` (both locales carry German strings on this site, VL-8-D14). The URL is not translatable text and stays in the template.
- The link uses `target="_blank"` with `rel="noopener"` (matches the existing Google Maps link and the Impressum credit, keeps the visitor on the practice site). No `noreferrer`, no `nofollow`, no `utm_`.
- Placement: a new `<div>` directly after the closing `</v-dialog>` inside the right-hand footer column (the one holding the logo and the Impressum link), so it sits under the Impressum link; that column is already centred on mobile and centred in the row on desktop.
- Styling uses only existing classes: the same classes as the Impressum link (`text-white font-weight-regular text-decoration-underline`) plus Vuetify's `text-caption` for the small size, plus a spacing utility (`mt-2`). No new `<style>` rule is needed; if one becomes necessary it uses only tokens from `assets/variables.scss`.
- `layouts/error.vue` has no footer and stays without the credit (CONCEPT Q2); the Impressum dialog and its existing credit (`imprint.conceptDesignProgramming`, `https://www.venturelabs.team`, in `Footer.vue`, `Navigation.vue`, `locales/*/imprint.js`) stay as they are (CONCEPT Q1).
- `tools/visual-parity/` is a manual docker comparison against the old build, not part of `cloudbuild.yaml`; its allowlist is not changed (CONCEPT Q3). The PR text says the footer gains one intended line.
- The site has one route (`pages/index.vue`); "every page" is checked mechanically over every `*.html` file in `dist/` that contains a `<footer` element.
- "Done" for this task = PR into `dev`; consent of the practice is recorded outside this repo (CONCEPT Q4) and gates only the later `dev` -> `main` merge, which no agent does.
Correct me at gate 1, otherwise I proceed with these.

## Existing code
- [concept] `features/VL-8-praxis-gerresheim-move-the-site-to-a-cur/CONCEPT.md`: used as background only; it explains the Nuxt 4 migration, the one-route site, and the visual-parity discipline that explains why the footer's whitespace handling is delicate. Nothing in it is changed.
- [code, landing] `landing-page/src/app/components/` (`Footer.tsx`, `LegalPage.tsx`, `ClientLogos.tsx`): dismissed - a different site (Next/React); its footer only carries `contact@venturelabs.team` mail links and no credit-link pattern to reuse.
- [code, arns-cluster] `edition/scripts/site/` (`pages.mjs`, `map.css`, `components.css`): dismissed - an unrelated generator for another product; no footer or credit logic that applies to this Nuxt site.
- [code, vl-finance-backend] `src/test/java/team/venturelabs/finance/`: dismissed - Java backend tests matching only on the words "link", "credit", "page"; unrelated.
- [code, praxis-gerresheim] `components/Footer.vue`: extended - one new `<div>` with an anchor in the existing right-hand column; the Impressum link markup is the style template.
- [code, praxis-gerresheim] `components/Navigation.vue` and `locales/*/imprint.js`: used as reference only (existing Impressum credit with `https://www.venturelabs.team`, `target="_blank"`); not changed.
- [code, praxis-gerresheim] `locales/de/homepage.js`, `locales/en/homepage.js`: extended - one new key each, next to `imprint: 'Impressum'`.
- [code, praxis-gerresheim] `scripts/check-theme-literals.mjs`: used - it runs in `yarn lint` and scans `<style>` blocks of `components/`, `layouts/`, `pages/`; the change adds no literal there.

## Context found
- Implements CONCEPT.md §S1 (`features/VL-33-footer-credit-link-to-venture-labs-on-ev/CONCEPT.md`), decisions D1-D6 in its `DECISIONS.md`, plus D7 (bounded vertical shift on desktop, see Risks) and the refined notes in `slices/S1.md`. Nothing beyond that section is in this spec.
- `layouts/default.vue` renders `<Footer />` after `<NuxtPage />` for the only route, so the footer is shared. `Footer` is registered there as `() => import('~/components/Footer.vue')` - unusual in Vue 3; confirm in the built `dist/index.html` that the footer is pre-rendered (see Stop conditions).
- `Footer.vue`, right-hand column: `<div class="d-md-flex flex-md-column align-center align-self-center">` holds the logo (`v-show="mdAndUp"`) and the `v-dialog` whose activator renders the Impressum link in `<div class="mt-6 mt-md-4">`. The `v-dialog` content is teleported to the body, so the new div after `</v-dialog>` is the next in-flow child.
- `.footer` sets `white-space: pre-line` and `&:first-line { line-height: 0 }`. Vue 3 condenses template whitespace between elements, but a newline inside the text of the new anchor would become a real line break. The anchor's text must be a single mustache on one line (`>{{ $t('homepage.creditVentureLabs') }}</a>`), no inner newlines; the existing `{{ '\n' }}` trick above the brand span is a warning of exactly this. The new div comes after the first line of the footer, so the `:first-line` rule is not affected, but this is verified in the rendered footer.
- `yarn lint` = `eslint . && node scripts/check-theme-literals.mjs`; the second only guards declarations in `<style>` blocks.

## Approach
Extend the existing footer component, same pattern as the Impressum link: text via `$t('homepage.…')`, classes from Vuetify utilities and the footer's white-on-dark-green look, no custom CSS. Add the locale key to both `homepage.js` files. One anchor, `href="https://venturelabs.team"`, `target="_blank"`, `rel="noopener"`.
Rejected: a footer-wide bottom row (restructures the footer, changes layout of all columns); a link inside the Impressum dialog only (exists already, not visible); `v-html` for the text (the existing imprint uses it for markup; a plain `$t` interpolation is enough and avoids raw HTML).
Layout note: the column is vertically centred on desktop (`align-self-center`), so the added line can move the logo and Impressum link up by up to half of the line's height; this is accepted and bounded in criterion 9 (see Risks).

## Files to change
| File | Change | Why |
|---|---|---|
| `components/Footer.vue` | add the credit `<div>` with the anchor after `</v-dialog>` in the right-hand column | the link itself |
| `locales/de/homepage.js` | add `creditVentureLabs: 'Umgesetzt von Venture Labs'` | text from the i18n source |
| `locales/en/homepage.js` | same key and value | both locales carry the same strings |
| `docs/specs/20261103-footer-credit-link-to-venture-labs-on-every-page.md` | this spec | written by the Architect |

## Acceptance criteria
1. After `yarn generate`, `dist/index.html` contains an `<a>` with `href="https://venturelabs.team"` and the visible text `Umgesetzt von Venture Labs`.
2. Every `*.html` file under `dist/` that contains a `<footer` element contains that anchor (checked by a script over all of `dist/`); at least `dist/index.html` is one of them.
3. That anchor carries no `nofollow` and no `utm_` anywhere in its attributes or href.
4. That anchor has `target="_blank"` and `rel="noopener"` (and no other `rel` token).
5. `components/Footer.vue` contains no literal `Umgesetzt von Venture Labs`; the text comes from `$t('homepage.creditVentureLabs')`, and both `locales/de/homepage.js` and `locales/en/homepage.js` define that key with that value.
6. The anchor text in the rendered HTML has no line break or leading/trailing newline inside the anchor, and the anchor sits after the Impressum link in the same right-hand footer column.
7. `yarn lint` passes (exit 0, eslint and `check-theme-literals`), and the added code adds no literal font-size, colour, margin, padding or gap to any `<style>` block.
8. `yarn generate` succeeds (exit 0) with no new build errors or warnings from the changed files compared with `dev`.
9. In a local preview of `dist/` at 390 px and 1440 px, compared with `dev`: the address column and the working-time columns keep their position and size; no horizontal position of the logo or Impressum link changes; the logo and Impressum link move vertically by no more than the credit line's own height; the credit line is visibly smaller than the Impressum link text, white on the dark-green footer, centred on mobile.
10. The Impressum dialog opens and shows its existing credit unchanged (same text and `https://www.venturelabs.team` link) at both widths.
11. `git diff` against `dev` touches only `components/Footer.vue`, `locales/de/homepage.js`, `locales/en/homepage.js` and this spec.
12. The PR text for the branch into `dev` contains the note "vor live: Zustimmung Praxis"; nothing is merged to `main` or deployed live.

## Test plan
The repo has no automated test suite (brief: the build is the test). Checks are the container commands from the brief: `yarn generate` (and `yarn lint`) inside the container for the Node version in `.nvmrc`, never host Node. Then a scripted check over `dist/` (grep/Node script over `**/*.html`) for criteria 1-4 and 6, and a grep over the source for criteria 5, 7, 11. The Tester also serves `dist/` locally and reads the rendered footer at 390 px and 1440 px (screenshot or `getBoundingClientRect` of the logo, Impressum link and credit line, on this branch and on `dev`) for criterion 9. No new test files are required; if the Implementer adds a throw-away check script it is not committed (criterion 11).

## What to click
1. Deploy preview, mobile width: scroll to the footer - "Umgesetzt von Venture Labs" sits small and centred under "Impressum", readable on dark green; click it - venturelabs.team opens in a new tab.
2. Desktop width: the line sits centred under "Impressum" below the logo; address and opening-time columns look the same as before.
3. Click "Impressum" - the dialog opens, its "Konzeption, Design, Programmierung - Venture Labs GmbH" credit is unchanged.

## Verification and evidence
- Criteria 1-4, 6: the close-out shows the command (e.g. `grep -rl "<footer" dist --include=*.html` and, per file, the extracted anchor tag) and its output; expected: every footer-bearing file lists exactly the anchor `<a href="https://venturelabs.team" target="_blank" rel="noopener" ...>Umgesetzt von Venture Labs</a>` (class attributes may differ).
- Criterion 5: `grep -n creditVentureLabs components locales` shows the three hits; `grep -n "Umgesetzt" components` shows none.
- Criteria 7, 8: output of `yarn lint` and `yarn generate` on the branch and on `dev` (merge-base), compared; both exit codes equal or better.
- Criterion 9: two screenshots of the footer (390 px, 1440 px) on branch and on `dev`, plus the measured vertical offsets of logo and Impressum link.
- Criteria 10, 11: screenshot of the open Impressum dialog; `git diff --stat dev...HEAD`.
- Criterion 12: the PR body shown via the PR note script; no `main` push.

## Will not do
- No merge or push to `main`, no live deploy, no change to hosting, DNS or Netlify settings.
- No change to the Impressum dialog, `Navigation.vue`, `locales/*/imprint.js`, `layouts/error.vue`, `tools/visual-parity/`, `nuxt.config.ts`, `assets/*`.
- No other repo is touched; no tracking, analytics event or UTM parameter.
- No dependency changes and no `yarn.lock` change.

## Stop conditions
- `dist/index.html` has no `<footer` element in the pre-rendered HTML (the lazily imported footer is only rendered client-side): stop and report; do not change `layouts/default.vue` without an amended spec.
- The logo, address or working-time columns move horizontally, or the footer grows by more than the credit line plus its margin: stop and ask instead of adding custom CSS.
- Any needed change outside the three files of criterion 11.
- The build or lint is red on `dev` already in a way that hides this change: report the base state, do not fix it here.

## Risks and open questions
- Layout: with `align-self-center` on the right-hand column, the added line shifts the logo and Impressum link up by up to half its height on desktop. CONCEPT's acceptance says the line "does not shift the logo, the Impressum link or the working-time columns"; a literal zero shift would need absolute positioning or a footer restructure (both out of the slice). Decided D7 (Conductor): no horizontal shift, the working-time and address columns do not move, and the vertical shift of logo and Impressum link is bounded by the line's own height (criterion 9). Say so at gate 1 if zero shift is required.
- Brief and code disagree on the stack (Nuxt 2 / Node 14 vs Nuxt 4 / Node 24); the spec follows the code. The container image comes from `.nvmrc` at run time, so the commands are unchanged.
- `text-caption` (Vuetify default 0.75rem) is not overridden in `variables.scss`'s `$typography`; the Implementer confirms in the preview that it is smaller than the Impressum link and still legible; if it is not, use another existing utility class, not a literal.
- Practice consent is not documented anywhere (CONCEPT Q4); only gates the live merge, which is a human step.
- The criterion "balanced" (9, plus What to click) is partly visual; it is judged by a human on the preview.

## Out of scope
- Credit on the error page, any other layout, or other client sites.
- Making the existing Impressum credit consistent (`www.` host, `rel`).
- Updating the stale Nuxt 2 description in the client's CLAUDE.md / knowledge base.
- Recording the practice's consent in the knowledge base.

## Write scope (mechanical check)

Written by the Dev Manager, not by the Architect - regenerated whenever the spec changes. Every path this spec makes somebody write outside the task's worktrees:

None: every path this spec writes is inside the task's worktrees.

Every other path outside the task's worktrees is read-only for every build role.
