// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'payload/**',
      'payload/.next/**',
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'dist/**'
    ]
  },
  {
    rules: {
      'vue/no-multiple-template-root': 'off',
      'vue/max-attributes-per-line': ['error', { singleline: 3 }]
    }
  }
)
