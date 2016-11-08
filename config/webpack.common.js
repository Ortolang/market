var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var app = './src/main/webapp/static/app/';

module.exports = {
    entry: {
        'polyfills': app + './polyfills.ts',
        'vendor': app + './vendor.ts',
        'app': app + './main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js'],
        alias: {
            'CETEIcean$': 'bower-CETEIcean',
            'highlight.js$': '../../../' + app + 'vendor/highlightjs.js'
        }
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap!' +
                    'postcss-loader!' +
                    'less?sourceMap'
                )
            },
            {
                test: /\/home\.html$/,
                loader: 'string-replace',
                query: {
                    search: '@@version',
                    replace: require('../package.json').version
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: app + 'index.html'
        }),

        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'Keycloak': 'keycloak-js',
            'atmosphere': 'atmosphere.js',
            'Holder': 'holderjs'
        }),

        // Ignore some locales for moment module
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
    ]
};
