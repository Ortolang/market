'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:description
 * @description
 * # description
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('description', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$root.$watch('ortolangPageDescription', function (newValue, oldValue) {
                    if (angular.isDefined(newValue)) {
                        element.attr('content', newValue);
                    }
                });
            }
        };
    });
