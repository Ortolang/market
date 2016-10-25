'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:profileCard
 * @description
 * # profileCard
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('profileCard', {
        bindings: {
            profile: '<',
            size: '@',
            imgClasses: '@'
        },
        controller: ['$scope', '$location', 'icons', function ($scope, $location, icons) {
            $scope.icons = icons;

            this.goToContributorPage = function () {
                if ($scope.profile.referentialId) {
                    $location.url('/contributors/' + $scope.profile.referentialId);
                }
            };
        }],
        transclude: true,
        templateUrl: 'common/components/profile-card.component.html'
    });
