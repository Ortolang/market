// const ENV = process.env.NODE_ENV = process.env.ENV = 'dev';

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
    mode: 'development',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:9000/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    devServer: {
        inline: true,
        port: 9000,
        historyApiFallback: true,
        // hot: true,
        stats: { colors: true },
        // contentBase: 'src/main/webapp/static/app'
    }
});
