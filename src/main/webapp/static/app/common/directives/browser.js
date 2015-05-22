'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:browser
 * @description
 * # browser
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('browser', function () {
        return {
            restrict: 'A',
            templateUrl: 'common/directives/browser.html',
            link: {
                pre: function (scope, element, attrs) {
                    element.addClass('container-fluid');
                }
            }
        };
    });
