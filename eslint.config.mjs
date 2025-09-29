import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      import: (await import('eslint-plugin-import')).default,
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/no-absolute-path': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/eslint.config.mjs'] }],
      'import/order': [
        'warn',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-restricted-imports': [
        'warn',
        {
          patterns: ['../*', '../../*', '../../../*'],
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
];

export default eslintConfig;
