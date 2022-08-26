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
        controller: ['$location', function ($location) {
            this.goToContributorPage = function () {
                if (this.profile.referentialId) {
                    $location.url('/contributors/' + this.profile.referentialId);
                }
            };
        }],
        transclude: true,
        templateUrl: 'common/components/profile-card.component.html'
    });
