const convert = require('koa-convert')

const webpack = require('webpack')
const webpackConfig = require('../../webpack/webpack.config.js')

exports = module.exports = function webpackDevMiddleware (app) {
  const compiler = webpack(webpackConfig)
  const middleware = require('koa-webpack-dev-middleware')(compiler, {
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
  })
  app.use(convert(middleware))

  const hotMiddleware = require('koa-webpack-hot-middleware')(compiler,{
       'log': false,
       'path': '/__webpack_hmr',
       'heartbeat': 10 * 1000
    })
  // // force page reload when html-webpack-plugin template changes
  // compiler.plugin('compilation', (compilation) => {
  //   compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
  //     hotMiddleware.publish({ action: 'reload' })
  //     cb()
  //   })
  // })
  app.use(convert(hotMiddleware))
}
