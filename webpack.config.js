var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = {
  entry:{
    "index":['./public/router.js'],
    "vendor":["vue","vue-router","muse-ui"]
  },
  output:{
    path:path.join(__dirname,'dist'),
    filename:'[name]-[chunkhash].js'
  },
  module:{
    loaders:[
      {
        test:/\.js$/,
        exclude:/node_modules/,
        loader:'babel',
        query:{
          presets:['es2015']
        }
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test:/\.css$/,
        loader:ExtractTextPlugin.extract('style-loader','css-loader')
      },
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=[name]_[chunkhash].[ext]'}
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  plugins:[
    new HtmlWebpackPlugin({template:"./public/index.html"}),
    new ExtractTextPlugin("[name]-[hash].css")
  ]
} ;

var argv = process.argv;
if(argv.indexOf('--hot')===-1){
  // 若是线上模式
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },output: {
      comments: false,
    }
  }));
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin("vendor","verdor-[chunkhash].js"));
  config.plugins.push(new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }));
}else{
  // 若是线下模式
  config.entry.index.unshift("webpack/hot/dev-server");
  config.devtool='inline-source-map';
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin("vendor","verdor-[hash].js"));
}

module.exports = config;
