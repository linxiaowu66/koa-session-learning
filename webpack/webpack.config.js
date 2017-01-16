'use strict'

var path = require('path')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../public')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var utils = require('./utils')

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    "index":['webpack-hot-middleware/client?reload=true', './public/router.js'],
    "vendor":["vue","vue-router","muse-ui"]
  },
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: utils.assetsPath('[name].js'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({template:"./public/index.html"}),
    new ExtractTextPlugin(utils.assetsPath("[name]-[hash].css")),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: utils.assetsPath("verdor-[hash].js") })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:{
          presets:['es2015']
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader' })
      }
    ]
  },
  performance: {
    hints: false
  }
}
