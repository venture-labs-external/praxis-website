# Praxis website

[Live Version](https://www.frauenaerztinnen-gerresheim.de)
[Dev Version 👨🏻‍💻](https://praxis-website.venturelabs.team/)

Nuxt 4 / Vue 3 / Vuetify 3, built as a fully static export (one page, no
API/CMS calls) with Node (see `.nvmrc` for the exact version) and Yarn
(classic).

## Build Setup

```bash
# install dependencies
yarn install

# serve with hot reload at localhost:3000
yarn dev

# generate the static site into dist/
yarn generate

# preview the generated static export locally
npx serve dist

# run linting
yarn lint
yarn lint:fix
```

`yarn lint` also runs `scripts/check-theme-literals.mjs`, which fails if a
`components/`, `layouts/` or `pages/` `<style>` block writes a literal
font-size, font-weight, line-height, letter-spacing, font-family, colour,
border-radius, box-shadow colour or margin/padding/gap value instead of a
named variable from `assets/variables.scss`/`assets/theme.js`.

## Visual parity (`tools/visual-parity/`)

Dev tooling (not shipped) that judges this branch's static export against
the old site - branch `main` by default (equal to the live site; the
pre-migration site, still Nuxt 2/Vue 2/Vuetify 2), configurable via
`--baseline=<ref>` (refuses `dev`, which has been the migrated site itself
since VL-8-S1 merged - see the comment at the top of `run.mjs`), or the live
site directly via `--live`. Builds both fresh (the baseline via a disposable
`git archive`, each inside the Node/Alpine image its own `.nvmrc` names;
skipped for `--live`, which is served directly), serves them locally, and
compares them with Playwright at 390/768/1440px for every state
`lib/states.mjs` lists (page load, after scrolling, card flipped, card-button
hover, phone menu open, each mobile-menu entry tapped, dialog from footer,
dialog from menu, header-button hover): computed typography, box geometry
(1px tolerance), the scroll position after a menu-entry tap, the dialog's
scrim colour/opacity and close-cross position, and a pixel-diffed full-page
screenshot per width. Needs Docker running (not needed at all for `--live`).

```bash
cd tools/visual-parity
yarn install
yarn compare
# or: yarn compare -- --baseline=<ref>   /   yarn compare -- --live
```

Writes `docs/visual-parity/report.md` (naming the commit, or "live", of each
side compared) and the raw data/screenshots under `tools/visual-parity/output/`
(gitignored); exits non-zero while any difference outside
`tools/visual-parity/allowlist.json` exists.

For detailed explanation on how things work, check out [Nuxt docs](https://nuxt.com).
