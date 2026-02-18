const path = require('path')

const { fixupConfigRules } = require('@eslint/compat')
const nextConfig = require('eslint-config-next/core-web-vitals')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const simpleImportSort = require('eslint-plugin-simple-import-sort')
const unusedImports = require('eslint-plugin-unused-imports')

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  { ignores: ['**/*.md'] },

  // Next.js core-web-vitals — wrapped for ESLint v10 compatibility
  // (eslint-plugin-react and others still use deprecated context APIs)
  ...fixupConfigRules(nextConfig),

  // TypeScript recommended rules — skip the base plugin-registration config
  // since next/typescript (above) already registers @typescript-eslint
  ...typescriptEslint.configs['flat/recommended'].slice(1),

  // Import sorting and unused imports plugins + global rules
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'error',
    },
  },

  // TS/TSX files: enable type-aware linting and disable overly strict rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
    rules: {
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
]
