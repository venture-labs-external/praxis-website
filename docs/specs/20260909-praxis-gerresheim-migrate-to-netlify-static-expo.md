---
task: 20260909-praxis-gerresheim-migrate-to-netlify-static-expo
company: venturelabs
status: ready
size: M
branch: feature/praxis-gerresheim-migrate-to-netlify-static-expo
base: dev
design: none
---

# Static-export the Praxis Gerresheim site to Netlify and add subtle scroll reveals

## Goal

Move the client site *Frauenärztinnen Gerresheim* off the self-hosted Google Cloud GKE
deployment (a Node server running `nuxt start`) onto Netlify static hosting, using the Nuxt 2
static export (`yarn generate` → `dist/`) that the repo already has as a script. On top of that,
add a small, professional set of entrance animations — a fade with a slight upward slide as each
section scrolls into view — to the existing sections, with no content, layout or framework
change. The task ends at a working Netlify deploy preview reviewed by Christian; DNS and the
Google Cloud hosting are untouched.

## Assumptions

- **Branch.** The worktree is already on `feature/praxis-gerresheim-migrate-to-netlify-static-expo`,
  cut from `dev`. The goal text names a different branch (`feature/netlify-static-hosting-and-animations`);
  I take the checked-out branch as the real one, because the environment forbids checkout/rebase.
- **Size is M, not S.** The audit's "fully static, one page" is right, but the change touches
  eleven repo files plus a build-toolchain risk (Node 14 → 20 under webpack 4). I sized the goal
  as stated rather than shrinking it; nothing is deferred.
- **Package manager is yarn.** `yarn.lock` is committed, `package-lock.json` is git-ignored, and
  the Dockerfile runs `yarn install`/`yarn build`. So the Netlify build command is `yarn generate`
  and local verification uses yarn too — the Dev Manager's configured `npm install --legacy-peer-deps`
  command is a generic default and would install a different tree from the one Netlify resolves.
- **`nuxt generate` on Node ≥17 needs `NODE_OPTIONS=--openssl-legacy-provider`.** `yarn.lock`
  pins nuxt 2.15.8 → webpack 4.46.0, whose md4 hashing hits `ERR_OSSL_EVP_UNSUPPORTED` under
  OpenSSL 3. *Unverified until the Implementer runs it* — this is the single most likely build
  failure, and the flag is the standard fix. Sass is dart-sass 1.32 (pure JS), so no native
  rebuild risk there.
- **`.nvmrc` must change.** Netlify reads a repo `.nvmrc`, and its documented precedence over the
  `NODE_VERSION` site variable means a pinned `v14.21.3` would win and fail (Node 14 is not
  installable on the current build image). *Precedence unverified against Netlify's current docs* —
  so I set both. The local workflow needs it too: the Dev Manager's own build command already
  starts with `nvm use 20`, i.e. nobody builds this repo on Node 14 today.
- **`target: 'static'` is not added to `nuxt.config.js`.** `nuxt generate` in the default
  `target: 'server'` mode is what this repo has always used; switching modes changes hydration and
  payload fetching for no gain on a single route with no `asyncData`. Nuxt's deprecation warning
  during generate is noise, not failure.
- **The hero is not animated.** `Header` is above the fold; revealing it would animate on load and
  risks reading as a delay. Reveals apply to the five below-the-fold sections. `Navigation` and
  `Footer` stay untouched.
- **`env.baseUrl` is cosmetic.** `cloudbuild.yaml` passes `--build-arg BASE_URL=…` but the
  Dockerfile declares no matching `ARG`/`ENV`, so the live GKE bundle already carries the
  `http://localhost:3000` default. Nothing in the app reads it (no axios call anywhere).
- **Netlify linking is done by the front desk**, not the Implementer: the spec gives the exact
  settings and a read-back, and no token is read or printed by any role.
- **No repo-level Netlify configuration file** is added; all build settings live in the Netlify
  site settings (such a file is outside this task's allowed paths anyway).
- **"Done" for the animation** is Christian's judgement on the preview at gate 3, not a metric.

Correct me at gate 1, otherwise I proceed with these.

## Context found

- `package.json`: `generate` = `nuxt generate` already defined; `test` = `jest`, but there is no
  jest config, no test directory and no Vue test harness — `npm test` cannot pass today.
- `yarn.lock`: nuxt 2.15.8, webpack 4.46.0, sass 1.32.13 (dart-sass), no `node-sass`, no `fibers`.
- `.nvmrc`: `v14.21.3`. `dockerfile`: `FROM node:14.17-alpine3.11`, `yarn install` + `yarn build`
  — it ignores `.nvmrc`, so bumping the file cannot affect the GKE image.
- `nuxt.config.js`: `plugins: ['~/plugins/vue-fragment']` (the pattern a new plugin extends),
  `css: ['~/assets/main.scss']` (the global stylesheet), `buildModules` include
  `@nuxtjs/eslint-module` → **ESLint runs inside the build**, so a lint error fails `generate`.
  `modules` include `@nuxtjs/axios` (unused) and `@nuxtjs/pwa` (emits a service worker into `dist/`).
  `i18n.vueI18n` nests `lazy`/`langDir`/`detectBrowserLanguage`, which vue-i18n ignores — messages
  are inlined, so there is no runtime locale fetch to break in a static export.
- `pages/index.vue`: the single route; renders `Header`, `News`, `Services`, `AboutUs`, `Team`,
  `Contact`. `layouts/default.vue` wraps them in `v-app` with `Navigation` and `Footer`.
- Section roots and ids: `News` `div#news`, `Services` `div#services`, `AboutUs` `div#about-us`,
  `Team` `section#team`, `Contact` `div#contact`, `Header` `header.header` (no id).
  `Navigation.scrollTo()` uses `$vuetify.goTo(hash)` against exactly those ids.
- `components/Contact.vue`: static address card (`CardWithButton`) plus a Google Maps `<iframe>`
  with a hard-coded embed URL — confirms the audit: nothing submits anywhere.
- `assets/main.scss`: plain global stylesheet (`.box-shadow`, `.no-wrap`, typography overrides) —
  the right place for the reveal classes.
- `plugins/vue-fragment.js`: four lines, `Vue.use(...)` — the shape a `Vue.directive(...)` plugin copies.
- `.eslintrc.js`: prettier (single quotes, semicolons, trailing commas), `simple-import-sort`,
  and under `NODE_ENV=production` `no-console` and `no-unused-vars` are **errors**.
- `static/`: every asset referenced by the components exists (checked one by one, incl. the
  leading-slash-less `header-image/header-image.png`, `news-image/news-image.png`,
  `dr-weydandtr.png`, `dr-korbmacher.png`).
- Knowledge base `clients/praxis-gerresheim/knowledge-base/hosting-and-stack.md`: current hosting,
  the Netlify site `praxis-gerresheim` created but unlinked, and the three risks to size.

## Approach

**Hosting.** Nothing in the app is dynamic, so the migration is configuration, not code: keep
`nuxt generate` in the repo's existing `target: 'server'` mode and let Netlify publish `dist/`.
The only repo-side blocker is the Node pin. `.nvmrc` moves from `v14.21.3` to `20`, because Node 14
cannot be installed by Netlify's current build image and because a repo `.nvmrc` outranks the
`NODE_VERSION` site variable; the Netlify site *also* gets `NODE_VERSION=20` so the answer does not
depend on that precedence. webpack 4's md4 hashing needs `NODE_OPTIONS=--openssl-legacy-provider`
on any OpenSSL-3 Node, set as a site build variable rather than baked into the build command so it
is visible in the site settings and identical to what the Implementer used locally. The Dockerfile
and the Cloud Build/Kubernetes files stay byte-identical, so the GKE deployment keeps building the
way it does today until Christian approves the cutover.

**Animation.** A hand-written `IntersectionObserver` directive, not a library: the whole behaviour
is ~40 lines, a library (AOS, `vue-observe-visibility`, `@vueuse`) would add a dependency to an
EOL Vue 2 tree for less code than it costs to audit, and the one thing a library would *not* give
us for free — the "never hide without JS" guarantee — is the part that matters here. Vuetify 2.4's
built-in `v-intersect` was the closer call and was rejected: with `vuetify: { treeShake: true }`
directive auto-import through vuetify-loader is unverified in this setup, and we would still
hand-write the class toggling and the reduced-motion guard, so it trades ~15 lines of observer
code for a build-config unknown.

The pattern is *JS opts elements out of visibility, never into it*: the markup and the CSS leave
every section fully visible; only the directive's client-side `inserted` hook adds
`reveal--pending` (opacity 0, `translateY(1rem)`, a 500 ms ease-out transition), and the observer
adds `reveal--in` (opacity 1, `transform: none`) on first intersection and then unobserves, so a
section never fades back out on scroll-up. If JS is absent, blocked or slow, no class is ever added
and the content is simply there — which is also why the pre-rendered HTML must contain no
`reveal--pending`. `prefers-reduced-motion: reduce` is honoured twice: the directive refuses to add
any class when `matchMedia('(prefers-reduced-motion: reduce)').matches`, and a
`@media (prefers-reduced-motion: reduce)` block neutralises both classes for users who flip the
setting after load. Reveal is applied to the five below-the-fold sections only; `transform` is
reset to `none` when revealed so no lasting containing block is created for fixed-position
descendants (Vuetify dialogs live under `[data-app]`, not inside these sections — checked).

**Testability without a test harness.** The repo has jest in `devDependencies` but no config,
no tests and no Vue testing stack; standing one up (vue-jest, @vue/test-utils, a babel config that
Nuxt's own babel would then also pick up) is a bigger and riskier change than the feature. Instead
the reveal logic lives in `utils/reveal.js` as a **dependency-free CommonJS module** of pure
functions with the window and the observer factory injected, so Node's built-in runner
(`node --test test/`, zero dependencies, zero config) can require it directly with fake `el` and
fake `win` objects; the Nuxt plugin is a thin `Vue.directive('reveal', …)` wrapper. Webpack 4
default-interops the CommonJS export cleanly. The `test` script is repointed from the broken
`jest` to `node --test test/`. A second test file asserts facts about the generated `dist/` —
sections pre-rendered, every referenced local image present, the maps iframe intact, no
`reveal--pending` in the HTML — which is exactly the class of regression a human clicking through
a preview would miss.

## Files to change

| File | Change | Why |
|---|---|---|
| `utils/reveal.js` | new — CommonJS module exporting `REVEAL_PENDING_CLASS`, `REVEAL_IN_CLASS`, `REVEAL_OBSERVER_OPTIONS`, `shouldAnimate(win)`, `createRevealDirective(getWindow?)` | the reveal logic, requireable by `node --test` without a transpiler |
| `plugins/reveal.js` | new — `import Vue from 'vue'; import reveal from '~/utils/reveal';` then `Vue.directive('reveal', reveal.createRevealDirective());` | registers the directive; mirrors `plugins/vue-fragment.js`. Registered universally (not `.client`) so `generate` does not warn about an unresolved directive; the hooks are client-only by nature |
| `nuxt.config.js` | add `'~/plugins/reveal'` to the existing `plugins` array | wires the plugin; no other key touched |
| `assets/main.scss` | add `.reveal--pending`, `.reveal--pending.reveal--in`, and a `@media (prefers-reduced-motion: reduce)` neutraliser | already the global stylesheet via `css:`; keeps the treatment in one place |
| `components/News.vue` | add `v-reveal` to the root `div#news` | animate the section |
| `components/Services.vue` | add `v-reveal` to the root `div#services` | animate the section |
| `components/AboutUs.vue` | add `v-reveal` to the root `div#about-us` | animate the section |
| `components/Team.vue` | add `v-reveal` to the root `section#team` | animate the section |
| `components/Contact.vue` | add `v-reveal` to the root `div#contact` | animate the section |
| `.nvmrc` | `v14.21.3` → `20` | Node 14 is not installable on Netlify's build image and a repo `.nvmrc` outranks `NODE_VERSION`; local builds already use 20 |
| `package.json` | `"test": "jest"` → `"test": "node --test test/"` | `jest` here is unconfigured and cannot pass; make `npm test` run the real tests |
| `test/reveal.test.js` | new (Test Writer) | unit tests for the reveal logic |
| `test/dist.test.js` | new (Test Writer) | assertions on the generated `dist/` |
| `README.md` | add the Netlify build settings, Node 20 and the `NODE_OPTIONS` flag to "Build Setup" | the next developer cannot build this repo without the flag |
| `docs/specs/20260909-…md` | this spec | plan of record |

Explicitly **not** touched: `dockerfile`, `cloudbuild.yaml`, `cloudbuild-live.yaml`,
`kubernetes.tpl.yaml`, `kubernetes-live.tpl.yaml`, `components/Header.vue`,
`components/Navigation.vue`, `components/Footer.vue`, `layouts/`, `locales/`, `static/`.

## Acceptance criteria

1. `yarn install --frozen-lockfile` followed by `NODE_OPTIONS=--openssl-legacy-provider yarn generate` exits 0 on Node 20 from a clean checkout of the branch, and writes `dist/index.html` plus `dist/_nuxt/`.
2. `dist/index.html` contains the pre-rendered markup of all six sections — a `<header` element and `id="news"`, `id="services"`, `id="about-us"`, `id="team"`, `id="contact"` — together with their German copy as literal text (not injected only by client JS).
3. Every local image path referenced by `dist/index.html` (each `src` and each `srcset` candidate that is not an absolute URL) exists as a file under `dist/`.
4. `dist/index.html` contains the Google Maps embed `<iframe>` whose `src` starts with `https://www.google.com/maps/embed?pb=`, unchanged from the source component.
5. Serving `dist/` over HTTP and loading `/` produces no console errors and no network request to `http://localhost:3000`.
6. No section's visibility depends on JavaScript: `dist/index.html` contains no `reveal--pending` and no inline `opacity:0` / `visibility:hidden` on a section root, and with JavaScript disabled all six sections are visible.
7. The CSS emitted into `dist/_nuxt/` defines `.reveal--pending` with `opacity: 0` and a `translateY` offset plus a `transition`, defines the revealed state restoring `opacity: 1` and `transform: none`, and contains a `@media (prefers-reduced-motion: reduce)` block that neutralises both.
8. `shouldAnimate(win)` returns `false` when the window has no `IntersectionObserver` and when `matchMedia('(prefers-reduced-motion: reduce)').matches` is true, and `true` otherwise; the directive's `inserted` then adds no class and creates no observer in the `false` cases.
9. When animation is allowed, `inserted` adds `reveal--pending` to the element and observes it with `threshold: 0.15` and `rootMargin: '0px 0px -10% 0px'`.
10. On the first intersecting entry the element gains `reveal--in`, keeps `reveal--pending`, and is unobserved — a revealed section is never re-hidden on scroll-up; a non-intersecting entry changes nothing.
11. `unbind` disconnects the observer created for that element and forgets it.
12. `v-reveal` appears on exactly five component roots — `News`, `Services`, `AboutUs`, `Team`, `Contact` — and `components/Header.vue`, `components/Navigation.vue`, `components/Footer.vue` and `layouts/default.vue` are unchanged relative to `dev`.
13. `yarn lint` reports no errors and `node --test test/` exits 0.
14. Netlify site `praxis-gerresheim` is linked to `venture-labs-external/praxis-website` with production branch `dev`, build command `yarn generate`, publish directory `dist`, and site build variables `NODE_VERSION=20` and `NODE_OPTIONS=--openssl-legacy-provider`; a read-back of the site settings shows exactly those values and the latest deploy state is `ready`.
15. A pull request from this branch into `dev` exists whose description carries the Netlify deploy-preview URL, and that URL returns HTTP 200 with the sections of criterion 2 present in the served HTML.
16. `.nvmrc` is the only Node pin changed: `dockerfile`, `cloudbuild.yaml`, `cloudbuild-live.yaml`, `kubernetes.tpl.yaml` and `kubernetes-live.tpl.yaml` are byte-identical to `dev`.
17. The PR description states which Node lever was used and why (`.nvmrc` bump + `NODE_VERSION` + the OpenSSL flag), as the answer to the requester's "say which, and why".

## Test plan

No tests exist in this repo today (`package.json` has `"test": "jest"` but no jest config, no test
directory, no Vue test harness). This task introduces `test/` with two files run by Node's built-in
runner — no new dependency, no config file:

```
node --test test/          # or: npm test  (after the script is repointed)
```

Prerequisite for `test/dist.test.js`: a completed
`NODE_OPTIONS=--openssl-legacy-provider yarn generate`. If `dist/` is absent the test fails with a
message naming that command rather than skipping silently.

The Tester runs, in order: `yarn install --frozen-lockfile`; `yarn lint`;
`NODE_OPTIONS=--openssl-legacy-provider yarn generate`; `node --test test/`; then serves the output
(`npx serve dist`) and checks the browser console and the network panel for criteria 5 and 6
(including one load with JavaScript disabled), and compares the served page section by section
against `https://www.frauenaerztinnen-gerresheim.de`. The Netlify half (criteria 14, 15) is verified
from the site settings read-back and the deploy log supplied by the front desk, plus a fetch of the
deploy-preview URL.

## Tests to write

| # | Criterion | Test (kind / file / under test / fixtures) | What breaks if it fails | Cost class |
|---|---|---|---|---|
| 1 | 8 | unit / `test/reveal.test.js` / `shouldAnimate` / fake `win` without `IntersectionObserver` | Old or restricted browsers get sections stuck at opacity 0 — an invisible page for the practice's patients | unit |
| 2 | 8 | unit / `test/reveal.test.js` / `shouldAnimate` / fake `win` whose `matchMedia` returns `{ matches: true }` | Users with Reduce Motion on (vestibular disorders — a medical practice's audience) get the motion anyway | unit |
| 3 | 8 | unit / `test/reveal.test.js` / `shouldAnimate` / fake `win` with `IntersectionObserver` and `matches: false` | Animation silently never runs; the feature ships dead | unit |
| 4 | 8 | unit / `test/reveal.test.js` / `shouldAnimate` / fake `matchMedia` recording its argument, asserted `=== '(prefers-reduced-motion: reduce)'` | A typo'd media query disables the guard while looking correct | unit |
| 5 | 8 | unit / `test/reveal.test.js` / `createRevealDirective().inserted` / fake `el` with recording `classList`, `win` failing `shouldAnimate` | The no-JS/reduced-motion path hides content instead of leaving it alone | unit |
| 6 | 9 | unit / `test/reveal.test.js` / `inserted` / fake `el` + `win` allowing animation | Sections start visible and never animate, or animate from the wrong state | unit |
| 7 | 9 | unit / `test/reveal.test.js` / `inserted` / fake `IntersectionObserver` capturing constructor options, asserted against `REVEAL_OBSERVER_OPTIONS` | Reveal fires at the wrong scroll position — too early (pointless) or too late (visible pop-in) | unit |
| 8 | 10 | unit / `test/reveal.test.js` / observer callback / fake entry `{ isIntersecting: true, target }` | The section never becomes visible once JS has hidden it — the worst failure mode of this feature | unit |
| 9 | 10 | unit / `test/reveal.test.js` / observer callback / assert `reveal--pending` still present after reveal | Losing the pending class drops the `transition`, turning the fade into a hard jump | unit |
| 10 | 10 | unit / `test/reveal.test.js` / observer callback / assert `unobserve(target)` called once | Sections re-animate on every scroll-up — the "distracting" failure Christian is checking for | unit |
| 11 | 10 | unit / `test/reveal.test.js` / observer callback / fake entry `{ isIntersecting: false }` | Sections reveal while still off-screen; the effect is invisible and the code is lying | unit |
| 12 | 11 | unit / `test/reveal.test.js` / `unbind` / fake observer recording `disconnect()` | Observers leak per re-render; a slow page on long sessions | unit |
| 13 | 8, 9 | unit / `test/reveal.test.js` / two fake `el`s through one directive instance | Two sections share one observer and reveal together, or one never reveals | unit |
| 14 | 2 | unit / `test/dist.test.js` / generated `dist/index.html` / requires a prior `yarn generate` | The static export renders an empty shell — the whole migration premise fails, and a human eyeballing a hydrated preview would not notice | unit |
| 15 | 2 | unit / `test/dist.test.js` / `dist/index.html` contains the German strings `Wo Sie uns finden`, `Das Praxisteam`, `Herzlich willkommen in unserer Frauenarztpraxis` | Copy silently lost in the export, or i18n resolves to keys instead of German | unit |
| 16 | 3 | unit / `test/dist.test.js` / parse every `src`/`srcset` in `dist/index.html`, assert each relative path exists under `dist/` | Broken images on the live site — the relative, leading-slash-less `header-image/…` and `dr-*.png` paths are exactly the kind that survive SSR and die on static hosting | unit |
| 17 | 4 | unit / `test/dist.test.js` / iframe `src` prefix `https://www.google.com/maps/embed?pb=` | Patients lose the only "where to find us" affordance on the page | unit |
| 18 | 6 | unit / `test/dist.test.js` / assert `dist/index.html` contains neither `reveal--pending` nor `opacity:0` / `visibility:hidden` on a section root | Content becomes JS-dependent: a failed bundle leaves a blank page for a medical practice | unit |
| 19 | 7 | unit / `test/dist.test.js` / concatenated `dist/_nuxt/*.css` contains `.reveal--pending` with `opacity:0`, the revealed override, and a `prefers-reduced-motion` block | The stylesheet is tree-shaken or never imported: either no animation at all, or hidden sections with no way back | unit |
| 20 | 5 | unit / `test/dist.test.js` / assert no `localhost:3000` occurrence in `dist/index.html` or `dist/_nuxt/*.js` **that is fetched at runtime** — if the string appears only as the dead `env.baseUrl` constant, the test records it and passes | A stray localhost request on the client would fail visibly in the console on the client's site | unit |
| 21 | 14 | **manual — no automated test.** The front desk reads back the Netlify site settings (build command, publish dir, production branch, `NODE_VERSION`, `NODE_OPTIONS`) and pastes them into the PR; no role in this task holds the Netlify token | Wrong build settings mean the preview Christian approves is not what a later deploy produces | unit |

## What to click

1. Every section top to bottom against `https://www.frauenaerztinnen-gerresheim.de` side by side — Header, News, Services, AboutUs, Team, Contact, Navigation, Footer — same German copy, same images, nothing missing.
2. The reveals at full-width and at phone width: a quiet fade with a small rise as each section enters, nothing sideways or bouncy, nothing that makes the page feel slow; scrolling back up does **not** replay them.
3. The Google Maps embed loads and pans; the nav items still jump to About us / Services / Contact and the mobile menu still opens and closes.
4. First load: no flash of unstyled content, no layout shift as sections reveal, and the page feels acceptable on a phone connection.
5. With the OS "Reduce Motion" setting on, the sections are simply there — no fade, no movement.

## Verification and evidence

- **Criteria 1, 13** — paste the tail of `NODE_OPTIONS=--openssl-legacy-provider yarn generate`
  showing exit 0 and the generated route, plus `yarn lint` and `node --test test/` summaries
  (`# pass`, `# fail 0`) into the close-out.
- **Criteria 2, 3, 4, 6, 7, 20** — `node --test test/` output for `test/dist.test.js`; the close-out
  names the `dist/index.html` size and the number of image paths checked.
- **Criteria 8–11** — `node --test test/reveal.test.js` output.
- **Criterion 5** — screenshot of the browser console and network tab on `npx serve dist`, empty of
  errors, filtered for `localhost`.
- **Criterion 6 (human half)** — screenshot of the page with JavaScript disabled, all sections visible.
- **Criterion 12, 16** — `git diff --stat dev...HEAD` in the close-out; it must list exactly the
  files in "Files to change" and none of the Docker/Cloud Build/Kubernetes files.
- **Criterion 14** — the front desk's read-back of the Netlify site settings (build command,
  publish directory, production branch, the two build variables) and the deploy log line showing
  the Node version actually used and `yarn install` (not npm) — pasted into the PR description.
- **Criterion 15, 17** — the PR link, the deploy-preview URL, and the Node-lever paragraph in the
  PR description; the Reviewer fetches the preview URL and confirms HTTP 200 with the section ids.
- **Gate 3** — Christian works through "What to click" on the deploy preview on his phone.

## Will not do

- No DNS change of any kind, and no touching `www.frauenaerztinnen-gerresheim.de` or
  `praxis-website.venturelabs.team`.
- Nothing in the Google Cloud projects `venture-labs-live` or `wenzel-it-consulting`: the GKE
  deployment, both load balancer fronts and the Cloud Build trigger keep running untouched. No edit
  to `dockerfile`, `cloudbuild*.yaml` or `kubernetes*.tpl.yaml`.
- No framework upgrade (Nuxt 2 → 3, Vue 2 → 3, Vuetify 2 → 3), no dependency added or removed.
- No content, copy, layout or new page; the contact section is not turned into a submitting form.
- No `checkout`, `rebase`, `merge`, or push to `main` or `dev` in any repo; no work in another repo.
- No reading or printing of `NETLIFY_API_TOKEN` or any other secret; no role but the front desk
  touches the Netlify account.
- No repo-level Netlify configuration file, no `_redirects`, no service-worker or PWA change.
- The Netlify site is not pointed at a custom domain and the production deploy is not published to
  anything the client can reach.

## Stop conditions

- `yarn generate` fails on Node 20 **with** `NODE_OPTIONS=--openssl-legacy-provider` and the fix is
  not a one-line environment change (for example a native module refusing to build, or a webpack 4
  incompatibility): stop, paste the error, ask. Do not upgrade Nuxt, swap a dependency, or edit
  `yarn.lock` to get past it.
- Netlify's build image rejects Node 20 for this build, or the documented `.nvmrc` /
  `NODE_VERSION` precedence turns out to be the opposite of the assumption above: stop and report
  the observed precedence rather than adding a Netlify config file.
- The reveal treatment changes how the page reads — reveals firing on the hero, sections popping,
  the page feeling slower: stop and describe the alternative (for example fade-only without the
  slide, or fewer animated sections) rather than tuning it silently.
- The Netlify build needs any secret or environment variable beyond `NODE_VERSION` and
  `NODE_OPTIONS`: stop and ask; do not invent one.
- `yarn install --frozen-lockfile` cannot resolve the lockfile on Node 20: stop; do not fall back to
  `npm install`, which would produce a tree Netlify never builds.
- Any need to touch DNS, Google Cloud, or the `dev`/`main` branches directly: stop.

## Risks and open questions

- **webpack 4 on OpenSSL 3** is the main build risk (nuxt 2.15.8 → webpack 4.46.0). The
  `--openssl-legacy-provider` flag is the standard fix and is assumed to work; the flag itself is
  removed in some future Node major, so the Node version and the flag must stay in step. Does not
  block the spec.
- **`.nvmrc` precedence over `NODE_VERSION` is unverified** against Netlify's current documentation.
  Setting both makes the outcome the same either way; the Implementer records what the build log
  actually shows. Does not block.
- **Deep links 404 differently.** The GKE SSR server renders `layouts/error.vue` for an unknown
  path; a static Netlify site will serve its own 404 page unless one is provided. Irrelevant for a
  one-page site today, but it should be decided before the DNS cutover. Does not block; noted for
  the cutover task.
- **The PWA service worker** is emitted into `dist/` by `@nuxtjs/pwa`. On a preview URL a cached
  worker can serve a stale build between deploys, which can confuse a review. Mitigation: review in
  a private window. Does not block.
- **No Designer round.** This is a motion treatment on existing screens, not a new screen or a
  layout change, so `design: none` and Christian judges the motion at gate 3 (What to click, line 2).
  If he would rather see a described alternative first, that is a gate-1 correction. Does not block.
- **The two halves are separable.** If the build turns out hard, the animation half is independently
  mergeable and vice versa — but only Christian decides to split; the spec is written whole.
- **`env.baseUrl`** ships `http://localhost:3000` as a dead constant into the bundle today (the
  Docker build arg has no matching `ARG`), so the Netlify build is not a regression. Cosmetic only,
  recorded in the PR. Does not block.

## Out of scope

- The DNS cutover, retiring the GKE deployment and the two load balancer fronts, and closing the
  GCP inventory items — a separate task after Christian approves the preview.
- Upgrading Nuxt 2 / Vue 2 / Vuetify 2 (all EOL upstream) — a fact to record, not this task.
- Removing the unused `@nuxtjs/axios`, `graphql`, `graphql-tag`, `vee-validate` and `jest`
  dependencies, and fixing the misplaced `i18n` `lazy`/`langDir`/`detectBrowserLanguage` keys under
  `vueI18n` — real cleanups, but this task is the smallest change.
- Turning the contact card into a submitting form, adding a privacy page, or any SEO/meta work
  (`og:image` is declared twice in `nuxt.config.js` — noted, not fixed here).
- Adding a Vue component test harness, Lighthouse CI, or wiring `lighthouserc.js` into anything.
- Performance work beyond not regressing: no image re-encoding, no font subsetting.
