// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  /**
   * This will disable the default indent rule for .vue files
   * since the script-indent makes the check. Otherwise, this
   * causes interference between both plugins.
   *
   * See: https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/script-indent.md
   */
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'vue/script-indent': ['error', 2, { 'baseIndent': 1 }]
      }
    }
  ]
}
