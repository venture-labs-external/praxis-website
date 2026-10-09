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
the `dev` branch's static export - the pre-migration site, still Nuxt 2/
Vue 2/Vuetify 2. Builds both fresh (the `dev` tree via a disposable
`git archive`, each inside the Node/Alpine image its own `.nvmrc` names),
serves them locally, and compares them with Playwright at 390/768/1440px for
the default/nav-open/dialog-open/flipcard-flipped states: computed
typography, box geometry (1px tolerance) and a pixel-diffed full-page
screenshot per width. Needs Docker running.

```bash
cd tools/visual-parity
yarn install
yarn compare
```

Writes `docs/visual-parity/report.md` and the raw data/screenshots under
`tools/visual-parity/output/` (gitignored); exits non-zero while any
difference outside `tools/visual-parity/allowlist.json` exists.

For detailed explanation on how things work, check out [Nuxt docs](https://nuxt.com).
