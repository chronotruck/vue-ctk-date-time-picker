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
  },
  config.plugin('extract-css').tap(([options]) => {
    options.filename = path.join('your/relative/asset/path', options.filename)
    return [options]
  })
}
