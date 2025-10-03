module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    browser: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'prettier'],
  globals: {
    __static: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_'
      }
    ],
    camelcase: 'off',
    'space-before-function-paren': 'off'
  }
}
