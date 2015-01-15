'use strict';

/**
 * @ngdoc overview
 * @name ortolangMarketApp
 * @description
 * # ortolangMarketApp
 *
 * Main module of the application.
 */
angular
    .module('ortolangMarketApp', [
        'ngAnimate',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'ortolangVisualizers',
        'angularFileUpload',
        'mgcrea.ngStrap.tab',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.aside',
        'mgcrea.ngStrap.helpers.dimensions',
        'mgcrea.ngStrap.tooltip',
        'mgcrea.ngStrap.dropdown',
        'mgcrea.ngStrap.typeahead',
        'mgcrea.ngStrap.alert',
        'hljs',
        'cfp.hotkeys',
        'formly',
        'ui.bootstrap.showErrors',
        'pascalprecht.translate',
        'zeroclipboard',
        'diff-match-patch'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/market'
            })
            .when('/market', {
                templateUrl: 'market/market-home.html',
                controller: 'MarketHomeCtrl'
            })
            .when('/market/:itemKey', {
                templateUrl: 'market/market-item.html',
                controller: 'MarketItemCtrl'
            })
            .when('/search', {
                templateUrl: 'market/market-search.html',
                controller: 'MarketSearchCtrl'
            })
            .when('/workspaces', {
                templateUrl: 'workspace/workspace.html',
                requiresAuthentication: true
            })
            .when('/workspaces/:wskey/:root/:path*\/browse', {
                templateUrl: 'workspace/workspace.html',
                requiresAuthentication: true
            })
            .when('/tools', {
                templateUrl: 'tool/tools.html',
                controller: 'ToolsCtrl',
                requiresAuthentication: true
            })
            .when('/tools/:plName', {
                templateUrl: 'tool/tool.html',
                controller: 'ToolCtrl',
                requiresAuthentication: true
            })
            .when('/processes/', {
                templateUrl: 'processes/processes.html',
                controller: 'ProcessesCtrl',
                requiresAuthentication: true
            })
            .when('/tasks/', {
                templateUrl: 'tasks/tasks.html',
                controller: 'TasksCtrl',
                requiresAuthentication: true
            })
            .when('/404', {
                templateUrl: '404.html'
            })
            .otherwise({
                redirectTo: '/404'
            });
    }])
    .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            'http://localhost:8080/**',
            'https://localhost:8443/**'
        ]);
    }])
    .config(['$tooltipProvider', function ($tooltipProvider) {
        angular.extend($tooltipProvider.defaults, {
            container: 'body'
        });
    }])
    .config(['uiZeroclipConfigProvider', function (uiZeroclipConfigProvider) {
        uiZeroclipConfigProvider.setZcConf({
            swfPath: '/vendor/ZeroClipboard.swf'
        });
    }]);

/**
 * @ngdoc overview
 * @name ortolangVisualizers
 * @description
 * # ortolangVisualizers
 *
 * Ortolang Visualizers Module
 */
angular.module('ortolangVisualizers', [
    'ortolangMarketApp'
]);
