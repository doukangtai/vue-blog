module.exports = {
  productionSourceMap: false,
  devServer: {
    open: false,
    host: 'localhost',
    port: '8082',
    proxy: {
      '/': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'highlight.js': 'hljs',
      'element-ui': 'ELEMENT',
      'core-js': 'core-js',
      'marked': 'marked',
      'mavon-editor': 'MavonEditor',
      'normalize.css': 'normalize.css',
    }
  }
}
