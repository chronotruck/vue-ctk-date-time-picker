module.exports = {
  presets: [
    '@vue/app'
  ],
  env: {
    test: {
      presets: [
        ['@vue/app', {
          useBuiltIns: 'entry',
          modules: 'commonjs'
        }]
      ],
      plugins: [
        'transform-es2015-modules-commonjs',
        'dynamic-import-node'
      ]
    }
  }
}
