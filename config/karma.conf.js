'use strict';
var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '../src/main/webapp/static/test',

        frameworks: ['jasmine'],

        files: [
            {pattern: '../app/test.ts', watched: false}
        ],

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-safari-launcher'),
            require('karma-firefox-launcher'),
            require('karma-opera-launcher'),
            require('karma-phantomjs-launcher'),
            require('karma-remap-istanbul'),
            require('karma-sourcemap-loader'),
            require('karma-junit-reporter'),
            require('karma-tap'),
            require('karma-tap-pretty-reporter'),
            require('karma-webpack')
        ],

        preprocessors: {
            '../app/test.ts': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: { colors: true }
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['progress', 'junit', 'tap-pretty', 'karma-remap-istanbul'],

        remapIstanbulReporter: {
            reports: {
                html: 'coverage',
                lcovonly: './reports/coverage/coverage.lcov'
            }
        },

        junitReporter: {
            outputDir: './reports/',
            outputFile: 'ortolang-junit-tests.xml'
        },

        tapReporter: {
            outputFile: './reports/test-results.tap',
            disableStdout: true
        },

        coverageReporter: {
            reporters: [
                {type: 'html', dir: './reports/coverage/'},
                {type: 'cobertura', dir: './reports/coverage/', subdir: '.'}
            ]
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_DEBUG,

        autoWatch: false,

        browsers: config.all ? ['PhantomJS', 'Safari', 'Chrome', 'Opera', 'Firefox'] : ['PhantomJS'],
        browserDisconnectTimeout: 20000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 4*60*1000,
        captureTimeout : 4*60*1000,

        singleRun: true
    };

    config.set(_config);
};
