var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'test';

module.exports = {
    devtool: 'source-map',

    resolve: commonConfig.resolve,

    module: {
        loaders: commonConfig.module.loaders
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),

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
                'ENV': JSON.stringify(ENV)
            }
        })
    ]
};
