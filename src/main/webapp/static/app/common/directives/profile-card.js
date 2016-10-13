'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:profileCard
 * @description
 * # profileCard
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('profileCard', ['$location', function ($location) {
        return {
            restrict: 'A',
            scope: {
                profile: '=',
                size: '@',
                imgClasses: '@'
            },
            link: function (scope) {
                scope.goToContributorPage = function () {
                    if (scope.profile.referentialId) {
                        $location.url('/contributors/' + scope.profile.referentialId);
                    }
                };
            },
            transclude: true,
            templateUrl: 'common/directives/profile-card-template.html'
        };
    }]);
