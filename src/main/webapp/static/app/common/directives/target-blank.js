'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:targetBlank
 * @description
 * # targetBlank
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('targetBlank', function () {
        return {
            scope: true,
            compile: function (element, attr) {
                return function (scope, element, attrs) {
                    scope.myContent = attrs.content;
                    scope.$watch(scope.myContent, function (newValue, oldValue) {
                        if (newValue) {
                            var elems = (element.prop('tagName') === 'A') ? element : element.find('a');
                            elems.attr('target', '_blank');
                        }
                    });
                };
            }
        };
    });
