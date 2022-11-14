import LRU from 'lru-cache';
import minifyTheme from 'minify-css-string';
import themeLight from '~/assets/theme';

const themeCache = new LRU({
  max: 10,
  maxAge: 1000 * 60 * 60, // 1 hour
});

export default {
  // Would need to set defaultAssets to false for offline support!
  theme: {
    dark: false,
    options: {
      customProperties: true,
      themeCache,
      minifyTheme,
    },
    themes: {
      light: themeLight,
    },
  },
  icons: { iconfont: 'mdiSvg' },
};
