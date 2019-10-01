const { resolve } = require('path')

module.exports = function VueCtkDateTimePicker () {
  this.addPlugin({
    ssr: false,
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'vue-ctk-date-time-picker.js'
  })
}

module.exports.meta = require(__dirname, './../package.json')
