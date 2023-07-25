module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': 1,
    'linebreak-style': 0,
    '@typescript-eslint/no-redeclare': 0,
    'import/prefer-default-export': 0,
  },
  root: true,
  env: {
    jest: true,
  },
  ignorePatterns: ['package.json'],
};
