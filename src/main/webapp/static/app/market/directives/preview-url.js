'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewUrl
 * @description
 * # previewUrl
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewUrl', ['ObjectResource', 'Content',  function (ObjectResource, Content) {
        return {
            restrict: 'EA',
            templateUrl: 'market/directives/preview-url-template.html',
            scope: {
                path: '=',
                alias: '=',
                root: '='
            },
            link: {
                pre : function (scope) {
                    scope.url = Content.getContentUrlWithPath(scope.path, scope.alias, scope.root);
                }
            }
        };
    }]);
