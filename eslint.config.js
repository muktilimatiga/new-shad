// @ts-check
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended (works even if you also lint JS)
  ...tseslint.configs.recommended,

  // TanStack preset
  ...tanstackConfig,

  // Your overrides (put LAST so they win)
  {
    rules: {
      /**
       * IMPORTS: stop being annoying
       * - Turn off TanStack's import ordering if it nags you
       * - Use simple-import-sort instead (or turn sorting off entirely)
       */
      'import/order': 'off',
      'sort-imports': 'off',

      // If you want sorting but less annoying, use this:
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      /**
       * UNUSED IMPORTS / VARS
       */
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      /**
       * ARRAY / SPREAD annoyance
       * If it complains about `export default [...tanstackConfig]`,
       * you can simply export `tanstackConfig` directly (recommended),
       * OR disable “useless spread” style rules (varies by preset).
       */
      'no-useless-spread': 'off',

      /**
       * Common TypeScript nags people usually relax
       */
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]
