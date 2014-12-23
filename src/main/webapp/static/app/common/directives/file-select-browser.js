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
            scope: {
                forceMimeTypes: '=',
                forceWorkspace: '=',
                forceHead: '=',
                fileSelectId: '='
            },
            templateUrl: 'common/directives/browser.html',
            link: {
                pre : function (scope, element, attrs) {
                    scope.isFileSelect = true;
                    scope.fileSelectAcceptMultiple = attrs.acceptMultiple &&
                        (attrs.acceptMultiple === 'true' || attrs.acceptMultiple === 'multiple');
                }
            }
        };
    });
