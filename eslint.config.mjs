// @nuxt/eslint's generated flat config (requires `nuxt prepare`, wired as this
// repo's `postinstall` script) plus the same rule intent as the old
// `.eslintrc.js`: Prettier formatting enforced as a lint rule, import order
// via `simple-import-sort`, and `console`/`debugger` left alone in dev. Ported
// from `.eslintrc.js` (Nuxt 2's `@nuxtjs/eslint-config`/`@nuxtjs/eslint-module`
// are gone - this repo's own Nuxt-aware flat config replaces them).
import withNuxt from './.nuxt/eslint.config.mjs';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default withNuxt(
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        { singleQuote: true, semi: true, trailingComma: 'all' },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
);
