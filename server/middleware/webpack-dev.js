import middleware from 'koa-webpack'

const webpack = require('webpack')
const webpackConfig = require('../../webpack/webpack.config.js')

exports = module.exports = function webpackDevMiddleware (app) {
  const compiler = webpack(webpackConfig)
  // // force page reload when html-webpack-plugin template changes
  // compiler.plugin('compilation', (compilation) => {
  //   compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
  //     hotMiddleware.publish({ action: 'reload' })
  //     cb()
  //   })
  // })
  app.use(middleware({
    compiler: compiler,
    dev: {
      publicPath: webpackConfig.output.publicPath,
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    },
    hot: {

    }
  }))
}
