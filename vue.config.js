const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  // GitHub Pages 项目站点部署：资源使用相对路径
  publicPath: './',
  devServer: {
    port: 80,
    https: false,
    open: false
  },
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.js$|\.html$|\.css$/,
        filename: '[path].gz[query]',
        minRatio: 1,
        threshold: 10240,
        deleteOriginalAssets: false
      })
    ]
  }
}
