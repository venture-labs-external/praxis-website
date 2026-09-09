# Praxis website

[Live Version](https://www.frauenaerztinnen-gerresheim.de)
[Dev Version 👨🏻‍💻](https://praxis-website.venturelabs.team/)

## Build Setup

Use **Node 20** (see `.nvmrc`) and **yarn** — `yarn.lock` is the committed lockfile.

Nuxt 2.15 pulls in webpack 4, whose md4 hashing fails with
`ERR_OSSL_EVP_UNSUPPORTED` on any Node built against OpenSSL 3 (Node ≥ 17). So
every build and generate needs `NODE_OPTIONS=--openssl-legacy-provider`.

```bash
# install dependencies
$ yarn install --frozen-lockfile

# serve with hot reload at localhost:3000
$ NODE_OPTIONS=--openssl-legacy-provider yarn dev

# build for production and launch server
$ NODE_OPTIONS=--openssl-legacy-provider yarn build
$ yarn start

# run linting
$ yarn lint
$ yarn lint:fix

# run the tests (Node's built-in runner, no config)
$ yarn test

# generate the static site into dist/
$ NODE_OPTIONS=--openssl-legacy-provider yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Hosting

The site is static — one route, no API or CMS calls — so `yarn generate` output
is all that gets served.

### Netlify (static)

Set in the Netlify site settings, not in a file in this repo:

| Setting | Value |
| --- | --- |
| Build command | `yarn generate` |
| Publish directory | `dist` |
| Production branch | `dev` |
| Build variable | `NODE_VERSION=20` |
| Build variable | `NODE_OPTIONS=--openssl-legacy-provider` |

`NODE_VERSION` and the `.nvmrc` above are deliberately both set to 20, so the
build does not depend on which of the two Netlify gives precedence.

### Google Cloud (GKE, current live hosting)

`dockerfile`, `cloudbuild*.yaml` and `kubernetes*.tpl.yaml` still build and run
the Node server image on Node 14 and are untouched by the Netlify setup — the
Dockerfile pins its own Node version and ignores `.nvmrc`.
