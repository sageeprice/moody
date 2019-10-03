'use strict'

// Reference: https://github.com/vuejs/vue-cli/blob/dev/docs/config/README.md
module.exports = {

  pages: {
    'index': {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      // when using title option, template title tag needs to be 
      // <title><%= htmlWebpackPlugin.options.title 
      title: 'Home',
      chunks: ['index'],
    },
    moody: {
      entry: 'src/pages/moody/main.js',
      template: 'public/index.html',
      // When using title option, template title tag needs to be 
      // <title><%= htmlWebpackPlugin.options.title 
      title: 'Moody',
      chunks: ['moody'],
    },
  }
}