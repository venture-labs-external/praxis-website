module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  plugins: ['simple-import-sort'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'max-len': 'off',
    'linebreak-style': 'off',
    'no-use-before-define': 'off',
    'vue-scoped-css/no-unused-selector': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-unused-selector': 'off',
    'vue/multi-word-component-names': 'off',
    'no-console':
      process.env.NODE_ENV === 'production'
        ? ['error', { allow: ['warn', 'error', 'info'] }]
        : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [
      process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      { argsIgnorePattern: '^_' },
    ],
    'template-curly-spacing': 'off',
    'no-mutating-props': 'off',
    'vue/no-mutating-props': 'off',
    'vue/order-in-components': 'error',
    'prettier/prettier': [
      'warn',
      { singleQuote: true, semi: true, trailingComma: 'all' },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
