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
    titleTemplate: 'titleTemplate',
    title: process.env.npm_package_name || 'Title',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  hooks: {},
  loading: { color: '#fff' },
  css: ['~/assets/main.scss'],
  plugins: ['~/plugins/vue-fragment'],
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de',
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
