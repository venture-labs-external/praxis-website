// Ported from the old `vueI18n.fallbackLocale` option nested in
// `nuxt.config.js` (`@nuxtjs/i18n` v10 only accepts `vueI18n` as a path to a
// vue-i18n config file, not an inline object).
export default defineI18nConfig(() => ({
  fallbackLocale: 'de',
}));
