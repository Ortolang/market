'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:orderIndicator
 * @description
 * # orderIndicator
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('orderIndicator', [function () {
        return {
            restrict: 'A',
            scope: {
                orderProp: '=',
                orderReverse: '=',
                name: '@',
                array: '@'
            },
            template: '<span ng-show="array ? orderProp[array] === name : orderProp === name" class="order-indicator"><span ng-show="orderReverse" class="glyphicon glyphicon-arrow-down"></span><span ng-hide="orderReverse" class="glyphicon glyphicon-arrow-up"></span></span>'
        };
    }]);
