var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require('vue-loader')
var commonConfig = require('./webpack.common.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'test';

module.exports = {
    devtool: 'source-map',
    mode: 'development',
    
    entry: commonConfig.entry,

    resolve: commonConfig.resolve,

    module: {
        rules: commonConfig.module.rules
    },

    optimization: commonConfig.optimization,

    plugins: [
        new VueLoaderPlugin(),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: "[id].css"
        }),

        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'Keycloak': 'keycloak-js',
            'atmosphere': 'atmosphere.js',
            'Holder': 'holderjs'
        }),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(ENV)
            }
        })
    ]
};
