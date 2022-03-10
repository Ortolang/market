
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    // devtool: 'source-map',
    mode: 'production',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: 'assets/[name].[hash].js',
        chunkFilename: 'assets/[id].[hash].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\/index\.html$/,
                use: [
                    {
                        loader: 'string-replace-loader',
                        query: {
                            search: '<!--<script src="ortolang-config-url"></script>-->',
                            replace: '<script src="${api_url}/config/client"></script>'
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        // new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
        //     mangle: false,
        //     sourceMap: false,
        //     minimize: true,
        // }),
    ]
});
