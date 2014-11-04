'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:fileSelectBrowser
 * @description
 * # fileSelectBrowser
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('fileSelectBrowser', function () {
        return {
            restrict: 'A',
            templateUrl: '/views/browser.html',
            link: function (scope, element, attrs) {
                scope.filterMimeTypeQuery = attrs.filterNameQuery;
            }
        };
    });
