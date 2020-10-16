'use strict';
var webpackConfig = require('./webpack.test');
process.env.CHROME_BIN = require('puppeteer').executablePath();

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
            // require('karma-remap-istanbul'),
            require('karma-sourcemap-loader'),
            require('karma-junit-reporter'),
            require('karma-webpack')
        ],

        preprocessors: {
            '../app/test.ts': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: false
        },

        // reporters: ['progress', 'junit', 'karma-remap-istanbul'],
        reporters: ['progress', 'junit'],

        // remapIstanbulReporter: {
        //     reports: {
        //         html: 'coverage',
        //         lcovonly: './reports/coverage/lcov.info'
        //     }
        // },

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

        browsers: config.all ? ['HeadlessChrome', 'Safari', 'Chrome', 'Firefox'] : ['HeadlessChrome'],
        browserDisconnectTimeout: 20000,
        browserDisconnectTolerance: 1,
        browserNoActivityTimeout: 4*60*1000,
        captureTimeout : 4*60*1000,

        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: ['--disable-web-security', '--disable-site-isolation-trials', '--no-sandbox']
            }
        },

        singleRun: true
    };

    config.set(_config);
};
