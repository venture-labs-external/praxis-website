import themeLight from '../assets/theme';

// Ported from Vuetify 2's `optionsPath` (`@nuxtjs/vuetify`) to Vuetify 3's own
// options shape (passed as `vuetifyOptions` to `vuetify-nuxt-module`). Vuetify 3
// has no theme cache / `minifyTheme` step (CSS custom properties replace the old
// runtime-generated `<style>` theme block), so `lru-cache` and
// `minify-css-string` are no longer needed (VL-8-D8) - same 10 colour values
// from `assets/theme.js` otherwise.
//
// `display.thresholds` is pinned to Vuetify 2's own historical default
// breakpoints (rather than trusting Vuetify 3's slightly different lg/xl
// defaults - 1280/1920 vs. 1264/1904) so `$vuetify`/`useDisplay()` keep
// switching at the same pixel widths as before; see `assets/variables.scss` for
// the matching SCSS breakpoint strings.
//
// `icons.defaultSet: 'mdi-svg'` matches the old build's `defaultAssets: false`
// (`@nuxtjs/vuetify`, `dev`'s `nuxt.config.js`): no component here uses a
// `v-icon`/`icon="mdi-…"` name (every icon is a raw inline SVG component -
// `Clock.vue`/`MapPin.vue`/`PhoneIcon.vue` - and every `<v-btn icon>` is the
// boolean "round button" prop wrapping an `<img>`, not an icon name), so
// `vuetify-nuxt-module`'s own default (`defaultSet: 'mdi'`, the CSS/CDN font
// icon set) would otherwise inject an unused, unasked-for
// `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@…">`
// into every page - a new third-party request the spec's "Will not do" list
// forbids. `mdi-svg` keeps Vuetify's own internal icon aliases resolvable
// (bundled SVG paths, no font file, no network request) without reintroducing
// that CDN line.
export default {
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: themeLight,
      },
    },
  },
  display: {
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1904,
    },
  },
  icons: {
    defaultSet: 'mdi-svg',
  },
};
