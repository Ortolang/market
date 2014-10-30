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
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.aside',
        'mgcrea.ngStrap.helpers.dimensions',
        'mgcrea.ngStrap.tooltip',
        'mgcrea.ngStrap.dropdown',
        'mgcrea.ngStrap.typeahead',
        'hljs',
        'cfp.hotkeys',
        'formly',
        'ui.bootstrap.showErrors'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/products'
            })
            .when('/market', {
                templateUrl: 'views/market-home.html',
                controller: 'MarketHomeCtrl'
            })
            .when('/market/:itemKey', {
                templateUrl: 'views/market-item.html',
                controller: 'MarketItemCtrl'
            })
            .when('/products', {
                templateUrl: 'views/products.html',
                controller: 'ProductsCtrl'
            })
            .when('/products/:productId', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            })
            .when('/workspaces/:wsName/:root/:path*\/browse', {
                templateUrl: 'views/browser.html',
                requiresAuthentication: true
            })
            .when('/logout', {
                templateUrl: 'views/products.html',
                controller: 'LogoutCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/myspace', {
                templateUrl: 'views/workspaces.html',
                controller: 'WorkspacesCtrl',
                requiresAuthentication: true
            })
            .when('/plugins', {
                templateUrl: '../views/tools.html',
                controller: 'PluginsCtrl',
                requiresAuthentication: true
            })
            .when('/plugins/:plName', {
                templateUrl: '../views/tool.html',
                controller: 'PluginCtrl',
                requiresAuthentication: true
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            'http://localhost:8080/**'
        ]);
    })
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'response': function (response) {
                    console.log('HTTP Status code ' + response.status + ': ' + response.statusText);
                    return response;
                },
                'responseError': function (rejection) {
                    if (rejection.status === 401) {
                        $location.path('/login');
                    }
                    console.log('HTTP Status code ' + rejection.status + ': ' + rejection.statusText);
                    return $q.reject(rejection);
                }
            };
        });
    }])
    .config(function ($tooltipProvider) {
        angular.extend($tooltipProvider.defaults, {
            container: 'body'
        });
    })
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
            var currentWorkspace = current.params.wsName;
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
//    'pdf'
]);
