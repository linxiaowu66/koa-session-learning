import middleware from 'koa-webpack'

const webpack = require('webpack')
const webpackConfig = require('../../webpack/webpack.config.js')

exports = module.exports = function webpackDevMiddleware (app) {
  const compiler = webpack(webpackConfig)
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
