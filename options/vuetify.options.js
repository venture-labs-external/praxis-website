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
};
