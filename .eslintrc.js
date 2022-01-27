module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  env: {
    es2021: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/prop-types': 0,
    'react/display-name': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'no-param-reassign': 'off', // mutating redux state in redux-toolkit.
    'import/no-unresolved': 'off', // raw-loader
    'global-require': 'off', // raw-loader
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
