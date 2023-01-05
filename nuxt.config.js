import de from './locales/de';
import en from './locales/en';

export default {
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },
  dev: process.env.NODE_ENV !== 'production',
  serverMiddleware: [],
  router: {
    trailingSlash: false,
  },
  head: {
    titleTemplate: 'Frauenärztinnen Gerresheim',
    title: process.env.npm_package_name || 'Title',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'author', name: 'author', content: 'Venture Labs' },
      { hid: 'og:url', name: 'og:url', content: '' },
      { hid: 'og:image', property: 'og:image', content: '/featured-image.jpg' },
      {
        hid: 'title',
        name: 'title',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'featured-image.jpg',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'apple-mobile-web-app-title',
        name: 'apple-mobile-web-app-title',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Frauenärztinnen Gerresheim',
      },
      {
        hid: 'og:favicon',
        rel: 'icon',
        type: 'image/x-icon',
        name: 'og:favicon',
        content: '/favicon.ico',
        href: '/favicon.ico',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/praxis.ico' }],
  },
  hooks: {},
  loading: { color: '#fff' },
  css: ['~/assets/main.scss'],
  plugins: ['~/plugins/vue-fragment'],
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', 'nuxt-i18n'],
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de',
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'de',
      detectBrowserLanguage: {
        useCookie: true,
        cookieKey: 'i18n_redirected',
        alwaysRedirect: false,
        fallbackLocale: en,
      },
      lazy: true,
      langDir: 'static',
      messages: {
        en,
        de,
      },
    },
  },
  render: {
    http2: {
      push: true,
    },
  },
  pwa: {
    workboxOptions: {
      importWorkboxFrom: 'local',
    },
  },
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/options/vuetify.options.js',
    defaultAssets: false,
  },
  proxy: {},
  build: {
    babel: {
      plugins: [['@babel/plugin-proposal-private-methods', { loose: true }]],
    },
  },
};
