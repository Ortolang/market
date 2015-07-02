'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:avatar
 * @description
 * # avatar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('avatar', function () {
        return {
            restrict: 'A',
            scope: {
                emailHash: '=',
                size: '@',
                imgClasses: '@'
            },
            template: '<img width="{{size}}px" ng-src="https://www.gravatar.com/avatar/{{emailHash}}?d=retro&s={{size}}" ng-class="imgClasses"/>'
        };
    });
