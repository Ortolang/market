'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:thumb
 * @description
 * # thumb
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('thumb', function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.children('img').bind('load.' + scope.$id, function () {
                    if (element.children('img')[0].naturalWidth > 1) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
                scope.$on('$destroy', function () {
                    element.children('img').unbind('load.' + scope.$id);
                });
            }
        };
    });
