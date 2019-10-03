'use strict'

// Reference: https://github.com/vuejs/vue-cli/blob/dev/docs/config/README.md
module.exports = {
  // publicPath: '/',

  pages: {
    'index': {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      title: 'Home',
      chunks: ['index'],
    },
    moody: {
      entry: 'src/pages/moody/main.js',
      template: 'public/index.html',
      title: 'Moody',
      chunks: ['moody'],
    },
  }
}