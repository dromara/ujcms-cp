module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  // 使用prettier格式化，格式以perttier为准，关闭部分eslint中关于代码格式的检查。
  // https://github.com/prettier/eslint-config-prettier/blob/main/index.js
  rules: {
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'linebreak-style': [0, 'error', 'windows'],
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // 避免使用Q_作为查询参数时报错
    '@typescript-eslint/camelcase': 'off',

    'max-len': 0,
    'vue/max-len': 0,
    'implicit-arrow-linebreak': 'off',
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'space-in-parens': 'off',
    "operator-linebreak": "off",
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
};
