module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  // overrides: [
  //   {
  //     env: {
  //       node: true
  //     },
  //     files: ['.eslintrc.{js,cjs}'],
  //     parserOptions: {
  //       sourceType: 'script'
  //     }
  //   }
  // ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error'
  }
}
