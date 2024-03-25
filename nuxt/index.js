const { resolve } = require('path')

module.exports = function VDatetimePicker () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'v-datetime-picker.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
