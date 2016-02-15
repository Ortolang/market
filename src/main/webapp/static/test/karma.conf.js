// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-19 using
// generator-karma 0.8.3

module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
            'bower_components/angular-strap/dist/angular-strap.js',
            'bower_components/angular-highlightjs/build/angular-highlightjs.js',
            'bower_components/angular-hotkeys/build/hotkeys.js',
            'bower_components/api-check/dist/api-check.js',
            'bower_components/angular-formly/dist/formly.js',
            'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
            'bower_components/angular-bootstrap-toggle-switch/angular-toggle-switch.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-i18n/angular-locale_fr.js',
            'bower_components/angular-translate/angular-translate.js',
            'bower_components/zeroclipboard/dist/ZeroClipboard.js',
            'bower_components/angular-zeroclipboard/src/angular-zeroclipboard.js',
            //'bower_components/angular-diff-match-patch/angular-diff-match-patch.js',
            //'bower_components/google-diff-match-patch/diff_match_patch_uncompressed.js',
            'bower_components/keycloak/dist/keycloak.js',
            'bower_components/angular-xeditable/dist/js/xeditable.js',
            'bower_components/ng-tags-input/ng-tags-input.js',
            'bower_components/angular-moment/angular-moment.js',
            'bower_components/moment/moment.js',
            'bower_components/moment/locale/fr.js',
            'bower_components/angulartics/src/angulartics.js',
            'bower_components/angulartics/src/angulartics-piwik.js',
            'bower_components/holderjs/holder.js',
            'bower_components/lrInfiniteScroll/lrInfiniteScroll.js',
            'bower_components/showdown/src/showdown.js',
            'bower_components/angular-markdown-directive/markdown.js',
            'test/mock/global.js',
            'app/**/!(ortolang-config).js',
            'test/mock/**/*.js',
            'test/spec/**/*.js',
            'app/**/*.html'
        ],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/**/*.js': ['coverage'],
            'app/**/*.html': ['ng-html2js']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'app/'
        },

        // list of files / patterns to exclude
        exclude: [
            'app/common/auth/interceptors.js'
        ],

        // web server port
        port: 9876,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-tapfile-reporter',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
//        proxies: {
//            '/': 'http://localhost:9000/'
//        },
        // URL root prevent conflicts with the site root
//        urlRoot: '/_karma_/',

        reporters: ['dots', 'junit', 'tapFile', 'coverage'],
        junitReporter: {
            outputDir: 'test/reports/'
        },
        tapFileReporter: {
            outputFile: 'test/reports/test-results.tap',
            suite: ''
        },
        coverageReporter: {
            reporters: [
                {type: 'html', dir: 'test/reports/coverage/'},
                {type: 'cobertura', dir: 'test/reports/coverage/', subdir: '.'}
            ]
        }
    });
};
