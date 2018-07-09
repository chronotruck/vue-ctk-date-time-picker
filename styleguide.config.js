const loaders = require('vue-webpack-loaders');
const glob = require('glob').sync;
const basename = require('path').basename;
const join = require('path').join;

function getDocSections() {
  b = p => basename(p, '.md');
  return glob('docs/*.md').filter(path => b(path) !== 'Introduction').map(path => ({
    name: b(path),
    content: path
  }));
}

/**
 * More info about this styleguide configuration in
 * vue-styleguidist/vue-styleguidist github repository
 */
module.exports = {
  sections: [
    {
      /* The component itself */
      name: 'vue-ctk-date-time-picker documentation',
      content: 'docs/Introduction.md',
      components: 'src/vue-ctk-date-time-picker/vue-ctk-date-time-picker.vue',
      ignore: ['src/vue-ctk-date-time-picker/vue-ctk-date-time-picker.md'],
      sections: getDocSections()
    },
  ],
  webpackConfig: {
    module: {
			loaders,
		},
    devtool: 'inline-source-map'
  },
  serverPort: 6062,
  require: [
    join(__dirname, 'styleguide.global.js'),
  ]
};
