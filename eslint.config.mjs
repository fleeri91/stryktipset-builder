// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Import order check
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // node built-ins
          'external', // npm packages
          'internal', // internal paths
          ['parent', 'sibling', 'index'], // relative imports
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
})
