'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:profileCard
 * @description
 * # profileCard
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('profileCard', function () {
        return {
            restrict: 'A',
            scope: {
                profile: '=',
                size: '@',
                imgClasses: '@'
            },
            transclude: true,
            templateUrl: 'common/directives/profile-card-template.html'
        };
    });
