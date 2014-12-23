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
            .when('/login', {
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
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
            swfPath: 'vendor/ZeroClipboard.swf'
        });
    }])
    .run(['$rootScope', '$location', 'AuthService', 'AuthEvents', function ($rootScope, $location, AuthService, AuthEvents) {
        /**
         * Check if user is authorized to the current url (mainly workspaces)
         */
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            //console.log(angular.lowercase(current));
            // Save current url is user is not logged in (except for login screen)
            if (!AuthService.isAuthenticated() && angular.lowercase(current.originalPath) !== '/login') {
                AuthService.saveAttemptUrl(current.originalPath);

                // redirect to login form if non authorized user try to access a page with requiresAuthentication=true
                if (current.requiresAuthentication) {
                    $rootScope.$broadcast('$auth:notAuthenticated', AuthEvents.notAuthenticated);
                    $location.path('/login');
                }
            }
            // restrain access to a workspace to authorized users
            var currentWorkspace = current.params.wskey;
            if (currentWorkspace) {
                if (!AuthService.isAuthorized(currentWorkspace)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast('$auth:notAuthorized', AuthEvents.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast('$auth:notAuthenticated', AuthEvents.notAuthenticated);
                    }
                }
            }
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
