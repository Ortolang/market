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
            template: '<img width="{{size}}px" ng-src="https://www.gravatar.com/avatar/{{emailHash ? emailHash + \'?d=retro\' : \'00000000000000000000000000000000?d=mm\'}}&s={{size}}" ng-class="imgClasses"/>'
        };
    });
