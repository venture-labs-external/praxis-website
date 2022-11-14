const resolve = require("path").resolve; // eslint-disable-line
const glob = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const path = require("path"); // eslint-disable-line

const plugins = [];

if (process.env.NODE_ENV === 'production') {
  class VuetifyExtractor {
    static extract(content) {
      return content.match(/[A-Za-z0-9-_:\\/]+/g) || [];
    }
  }

  const purgecss = new PurgecssPlugin({
    // Specify the locations of any files you want to scan for class names.
    paths: glob.sync([
      path.join(__dirname, './node_modules/vuetify/src/components/VApp/*.ts'),
      path.join(__dirname, './node_modules/vuetify/src/components/VCard/*.ts'),
      path.join(
        __dirname,
        './node_modules/vuetify/src/components/VRating/*.ts',
      ),
      path.join(__dirname, './node_modules/vuetify/src/components/VSheet/*.ts'),
      path.join(__dirname, './node_modules/vuetify/src/components/VIcon/*.ts'),
      path.join(__dirname, './node_modules/vuetify/src/components/VChip/*.ts'),
      path.join(__dirname, './node_modules/vuetify/src/components/VTabs/*.ts'),
      path.join(
        __dirname,
        './node_modules/vuetify/src/components/VToolba/*.ts',
      ),
      path.join(__dirname, './node_modules/vuetify/src/components/VImg/*.ts'),
      path.join(
        __dirname,
        './node_modules/vuetify/src/components/VDivider/*.ts',
      ),
      path.join(
        __dirname,
        './node_modules/vuetify/src/components/VContainer/*.ts',
      ),
      path.join(__dirname, './node_modules/vuetify/src/components/VHover/*.ts'),
      path.join(
        __dirname,
        './node_modules/vuetify/src/components/VProgresslinear/*.ts',
      ),
      path.join(__dirname, './node_modules/vuetify/src/components/VBtn/*.ts'),
    ]),
    extractors: [
      {
        extractor: VuetifyExtractor,

        // Specify the file extensions to include when scanning for
        // class names.
        extensions: ['html', 'js', 'vue'],
      },
    ],
  });
  plugins.push(purgecss);
}

// Minimal Webpack config to supply to Eslint.
// This is not actually used by Nuxt but instead mirrors
// the resolve and loader rules.
module.exports = {
  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules'],
    extensions: ['.js', '.vue'],
    alias: {
      '~': __dirname,
      // '@/': `${__dirname}/`,
      '@': __dirname,
      // your aliases go here.
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: "@import '@/styles/variables.scss';",
            },
          },
        ],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ],
  },
  plugins,
};
