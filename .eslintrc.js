// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/strongly-recommended',
    'eslint:recommended',
    'plugin:vue/essential',
    '@vue/standard'
  ],

  rules: {
    'generator-star-spacing': 0,
    'arrow-parens': 0,
    'prefer-const': 2,
    'no-trailing-spaces': 'error',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-extra-semi': 'error',
    semi: [
      'error',
      'never'
    ],
    'no-var': 'error',
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        [
          'OTHER_ATTR', // v-bind order is important since vue3 (https://v3.vuejs.org/guide/migration/v-bind.html#_3-x-syntax)
          'GLOBAL'
        ],
        'EVENTS',
        'CONTENT'
      ],
      alphabetical: false
    }],
    'vue/no-confusing-v-for-v-if': 'error',
    'vue/no-v-html': 'error',
    'vue/order-in-components': 'error',
    'vue/this-in-template': 'error',
    'vue/script-indent': 'error',
    'vue/v-slot-style': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
        'vue/script-indent': ['error', 2, { baseIndent: 1 }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase']
      }
    }
  ]
}
