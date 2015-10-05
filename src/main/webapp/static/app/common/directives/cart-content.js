'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:cartContent
 * @description
 * # cartContent
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('cartContent', ['Cart', function (Cart) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.Cart = Cart;
            }
        };
    }]);
