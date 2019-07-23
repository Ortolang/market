var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var app = './src/main/webapp/static/app/';

module.exports = {
    entry: {
        'polyfills': app + './polyfills.ts',
        'vendor': app + './vendor.ts',
        'app': app + './main.ts'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'highlight.js$': '../../../' + app + 'vendor/highlightjs.js'
        }
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    },
                    {
                        loader: 'angular2-template-loader'
                    },
                    {
                        loader: 'required-loader',
                        options: {
                            import: [
                                'angular'
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'ng-cache-loader',
                        options: {
                            prefix: 'app:**'
                        }
                    }
                ],
                exclude: /(index|ie|google.+)\.html/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ],
                include: /index\.html/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ],
                include: /(ie|google.+)\.html/
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/[name].[hash].[ext]'
                        }
                    }
                ],
                exclude: /assets\/icons\//
            },
            {
                test: /\.css$/,
                // use: 
                //     ExtractTextPlugin.extract({
                //         fallback: "style-loader",
                //         use: {
                //             loader: "css-loader",
                //             options: {
                //                 minimize: true,
                //                 sourceMap: true
                //             }
                //         }
                //     })
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader",
                    "less-loader"
                ]
            },
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: [
            //             {
            //                 loader: "css-loader",
            //                 options: {
            //                     minimize: true,
            //                     sourceMap: true
            //                 }
            //             }, 
            //             {
            //                 loader:'postcss-loader'
            //             }, 
            //             {
            //                 loader:'less-loader',
            //                 options: { sourceMap: true }
            //             }
            //         ]
            //     })
            // },
            {
                type: 'javascript/auto',
                test: /(robots\.txt|\.xml|\.ico|\.json)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]'
                        }
                    }
                ],
                exclude: /ortolang-config\.json/
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/icons/[name].[ext]'
                        }
                    }
                ],
                include: /assets\/icons\//
            },
            // {
            //     test: /\/home\.html$/,
            //     use: [
            //         {
            //             loader: 'string-replace-loader',
            //             query: {
            //                 search: '@@version',
            //                 replace: require('../package.json').version
            //             }
            //         }
            //     ],
            // }
        ]
    },

    // optimization: {
    //     runtimeChunk: "single", // enable "runtime" chunk
    //     splitChunks: {
    //         cacheGroups: {
    //             vendor: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendor",
    //                 chunks: "all"
    //             }
    //         }
    //     }
    // },

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
        minimize: false
    },

    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: ['app', 'vendor', 'polyfills']
        // }),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: "[id].css"
        }),

        new HtmlWebpackPlugin({
            template: app + 'index.html',
            minify: {
                removeAttributeQuotes: false
            }
        }),

        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.jQuery': 'jquery',
            'Keycloak': 'keycloak-js',
            'atmosphere': 'atmosphere.js',
            'Holder': 'holderjs',
            'window.FileUploader': 'angular-file-upload',
            'FileUploader': 'angular-file-upload'
        }),

        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: process.env.ENV === 'production'
        //     },
        //     sourceMap: true,
        //     minimize: true,
        //     comments: false
        // }),

        // Ignore some locales for moment module
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/)
    ]
};
