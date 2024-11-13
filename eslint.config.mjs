import stylistic from '@stylistic/eslint-plugin'
import withNuxt from './.nuxt/eslint.config.mjs'

/**
 * https://qiita.com/yuki_s_14/items/96620ccfb1dd897ce9f3
 */
export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      'default-param-last': 'warn',
      'eqeqeq': 'warn',
      'no-constant-condition': 'warn',
      'no-cond-assign': 'error',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/no-multiple-template-root': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
    },
  },
  stylistic.configs.customize({
    indent: 2, // インデントはスペース2
    quotes: 'single', // クオートはシングル
    semi: false, // セミコロンは不要
  }),
)
