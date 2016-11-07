'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:orderIndicator
 * @description
 * # orderIndicator
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('orderIndicator', {
        bindings: {
            orderProp: '<',
            orderReverse: '<',
            name: '@',
            array: '@'
        },
        template: '<span ng-show="$ctrl.array ? $ctrl.orderProp[$ctrl.array] === $ctrl.name : $ctrl.orderProp === $ctrl.name" class="order-indicator"><span ng-show="$ctrl.orderReverse" class="glyphicon glyphicon-arrow-down"></span><span ng-hide="$ctrl.orderReverse" class="glyphicon glyphicon-arrow-up"></span></span>'
    });
