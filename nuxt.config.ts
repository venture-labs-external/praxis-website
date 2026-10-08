import { fileURLToPath } from 'node:url';

const TITLE =
  'Frauenärztinnen Gerresheim - Dr.med. Heike Weydandt und Dr.med. Rahel Korbmacher';
const DESCRIPTION =
  'Herzlich Willkommen! Wir freuen uns auf ihren Besuch in unserer Praxis.';

// Ported from Nuxt 2's `nuxt.config.js` to Nuxt 3/4's config shape (VL-8-S1).
export default defineNuxtConfig({
  compatibilityDate: '2026-10-09',

  // Keep the existing root-level `pages/`, `components/`, `layouts/`,
  // `plugins/`, `assets/`, `public/` layout (Nuxt auto-detects and keeps this
  // backwards-compatible structure instead of requiring the new `app/`
  // directory) - matches this spec's "Files to change" paths one-for-one.
  srcDir: '.',

  devtools: { enabled: false },

  modules: ['@nuxtjs/i18n', 'vuetify-nuxt-module', '@nuxt/eslint'],

  app: {
    head: {
      title: 'Frauenärztinnen Gerresheim',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        { key: 'author', name: 'author', content: 'Venture Labs' },
        { key: 'og:url', name: 'og:url', content: '' },
        { key: 'og:image', property: 'og:image', content: '/featured-image.jpg' },
        { key: 'title', name: 'title', content: TITLE },
        { key: 'og:title', name: 'og:title', content: TITLE },
        {
          key: 'apple-mobile-web-app-title',
          name: 'apple-mobile-web-app-title',
          content: TITLE,
        },
        { key: 'og:site_name', name: 'og:site_name', content: TITLE },
        { key: 'description', name: 'description', content: DESCRIPTION },
        {
          key: 'og:description',
          name: 'og:description',
          content: DESCRIPTION,
        },
        {
          key: 'og:favicon',
          rel: 'icon',
          type: 'image/x-icon',
          name: 'og:favicon',
          content: '/favicon.ico',
          href: '/favicon.ico',
        },
        {
          key: 'mobile-web-app-capable',
          name: 'mobile-web-app-capable',
          content: 'yes',
        },
        {
          key: 'og:type',
          name: 'og:type',
          property: 'og:type',
          content: 'website',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/praxis.ico' },
        {
          key: 'icon',
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        // Replaces the hashed icons `@nuxtjs/pwa` used to inject at build time
        // (dropped, see `plugins/unregister-sw.client.js`) with the same PNGs,
        // copied once from a reference build of `dev`, at stable paths.
        {
          key: 'shortcut-icon',
          rel: 'shortcut icon',
          href: '/icons/icon-64x64.png',
        },
        {
          key: 'apple-touch-icon-512',
          rel: 'apple-touch-icon',
          href: '/icons/icon-512x512.png',
          sizes: '512x512',
        },
        {
          key: 'manifest',
          rel: 'manifest',
          href: '/manifest.webmanifest',
        },
      ],
    },
  },

  css: ['~/assets/main.scss'],

  // nuxt-i18n's `detectBrowserLanguage` is intentionally left unset here: in
  // the old config it was nested inside `vueI18n` (the wrong place for that
  // module to read it from), so it was already inert - no visitor was ever
  // redirected. `@nuxtjs/i18n` v10 reads this option from the top level and
  // would make it live if set, so leaving it unset keeps the same no-op
  // behaviour rather than "fixing" it into a real redirect (VL-8-D11).
  i18n: {
    restructureDir: '.',
    langDir: 'locales',
    locales: [
      { code: 'en', file: 'en/index.js' },
      { code: 'de', file: 'de/index.js' },
    ],
    defaultLocale: 'de',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
  },

  vuetify: {
    moduleOptions: {
      // `useLayout` collides with Nuxt's own built-in auto-import; everything
      // this app actually imports from `vuetify` (`useDisplay`, `useGoTo`) is
      // imported explicitly, not auto-imported, so this only silences the
      // unused `useLayout` collision warning.
      prefixComposables: ['useLayout'],
      styles: {
        configFile: './assets/variables.scss',
      },
    },
    vuetifyOptions: './options/vuetify.options.js',
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Replaces `@nuxtjs/vuetify`'s old `customVariables`: the same
          // breakpoint/typography SCSS variables are prepended to every
          // `.scss`/`<style lang="scss">` block in the app, so component
          // styles keep using `$md-and-up` etc. without importing anything.
          additionalData: '@use "./assets/variables.scss" as *;',
        },
      },
    },
  },

  // Keeps the Nitro static export at `dist/` instead of Nuxt 3/4's new
  // `.output/public/` default, so Netlify's existing "build `yarn run
  // generate` -> publish `dist`" site setting keeps working unchanged
  // (VL-8-D12, no `netlify.toml` needed/allowed).
  nitro: {
    output: {
      publicDir: fileURLToPath(new URL('./dist', import.meta.url)),
    },
  },
});
