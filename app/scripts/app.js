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
        'ngCookies',
        'ngRoute',
        'ngResource',
        'angularFileUpload',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.helpers.dimensions',
        'hljs'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/products'
            })
            .when('/products', {
                templateUrl: 'views/products.html',
                controller: 'ProductsCtrl'
            })
            .when('/products/:productId', {
                templateUrl: 'views/product.html',
                controller: 'ProductCtrl'
            })
            .when('/workspaces/:wsName/:rootName/:elementPath*\/browse', {
                templateUrl: 'views/browser.html'
            })
            .when('/logout', {
                templateUrl: 'views/main.html',
                controller: 'LogoutCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/myspace', {
                templateUrl: 'views/workspaces.html',
                controller: 'WorkspacesCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(['$rootScope', 'AuthService', 'AuthEvents', function ($rootScope, AuthService, AuthEvents) {
        /**
         * Check if user is authorized to the current url (mainly workspaces)
         */
        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            //console.log(current);
            var currentWorkspace = current.params.wsName;
            if (currentWorkspace) {
                if (!AuthService.isAuthorized(currentWorkspace)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AuthEvents.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AuthEvents.notAuthenticated);
                    }
                }
            }
        });
    }]);
