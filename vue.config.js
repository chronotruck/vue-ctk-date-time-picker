module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: './',
  lintOnSave: undefined,
  configureWebpack: {
    externals: {
      vue: 'vue',
      moment: 'moment',
      'moment-range': 'moment-range'
    }
  }
}
