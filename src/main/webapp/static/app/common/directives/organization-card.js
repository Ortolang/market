'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:organizationCard
 * @description
 * # organizationCard
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('organizationCard', function () {
        return {
            restrict: 'A',
            scope: {
                organization: '=',
                size: '@',
                imgClasses: '@'
            },
            templateUrl: 'common/directives/organization-card-template.html'
        };
    });
