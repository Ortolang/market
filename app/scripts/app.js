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
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/products', {
              templateUrl: 'views/products.html',
              controller: 'ProductsCtrl'
            })
            .when('/products/:productId', {
              templateUrl: 'views/product.html',
              controller: 'ProductCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
