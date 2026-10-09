// @nuxt/eslint's generated flat config (requires `nuxt prepare`, wired as this
// repo's `postinstall` script) plus the same rule intent as the old
// `.eslintrc.js`: Prettier formatting enforced as a lint rule, import order
// via `simple-import-sort`, and `console`/`debugger` left alone in dev. Ported
// from `.eslintrc.js` (Nuxt 2's `@nuxtjs/eslint-config`/`@nuxtjs/eslint-module`
// are gone - this repo's own Nuxt-aware flat config replaces them).
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(prettierConfig, {
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
    // The old `.eslintrc.js` only extended `plugin:vue/essential` (the
    // safety-rules-only tier); `@nuxt/eslint`'s flat preset pulls in Vue's
    // broader stylistic/recommended rules by default. Turned off here to
    // keep the same lint behaviour "in spirit" rather than a new pile of
    // warnings/errors this port didn't introduce a bug for.
    'vue/attributes-order': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/no-v-html': 'off',
    'vue/no-template-shadow': 'off',
    'vue/v-slot-style': 'off',
    'vue/component-definition-name-casing': 'off',
    // `Header`/`Footer` are component names this app already used under
    // Vue 2 without issue; renaming them is out of this port's scope.
    'vue/no-reserved-component-names': 'off',
  },
});
