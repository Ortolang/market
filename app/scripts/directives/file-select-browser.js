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
            scope: {},
            templateUrl: '/views/browser.html',
            link: {
                pre : function (scope, element, attrs) {
                    scope.isFileSelect = true;
                    scope.filterMimeTypeQuery = attrs.filterMimeTypeQuery;
                }
            }
        };
    });
