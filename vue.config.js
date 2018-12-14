module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  indexPath: 'index.html',
  runtimeCompiler: true,
  baseUrl: './',
  devServer: {
    watchOptions: {
      poll: true
    }
  }
}
