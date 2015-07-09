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
            link: function (scope, element, attrs) {
                element.children('img').bind('load', function () {
                    if (element.children('img')[0].naturalWidth > 1) {
                        element.removeClass('ng-hide');
                    } else {
                        element.addClass('ng-hide');
                    }
                });
            }
        };
    });
