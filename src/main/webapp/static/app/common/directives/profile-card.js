'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:profileCard
 * @description
 * # profileCard
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('profileCard', ['$location', 'Helper', function ($location, Helper) {
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
                        $location.url('/contributors/' + Helper.extractNameFromReferentialId(scope.profile.referentialId));
                    }
                };
            },
            transclude: true,
            templateUrl: 'common/directives/profile-card-template.html'
        };
    }]);
