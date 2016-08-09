'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:homeNews
 * @description
 * # homeNews
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('homeNews', ['StaticWebsite', function (StaticWebsite) {
        return {
            restrict: 'A',
            scope: {
                limit: '@'
            },
            templateUrl: 'market/directives/home-news.html',
            link: function (scope) {
                scope.StaticWebsite = StaticWebsite;
                scope.staticWebsiteBase = StaticWebsite.getStaticWebsiteBase();
            }
        };
    }]);
