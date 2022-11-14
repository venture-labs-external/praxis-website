module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['html'],
  extends: ['@vue/airbnb', 'plugin:vue/recommended'],
  rules: {
    'max-len': 0,
    'linebreak-style': 0,
    'template-curly-spacing': 'off',
    indent: [
      'error',
      2,
      {
        ignoredNodes: ['TemplateLiteral'],
      },
    ],
  },
  globals: {},
  settings: {
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
};
