'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', 'User', 'AuthService', 'ProfileResource', function ($scope, User, AuthService, ProfileResource) {

        function getUser() {
            ProfileResource.connected().$promise.then(function (profile) {
                $scope.currentUser = User.create(profile);
            });
        }

        /**
         * Initialize scope var from the session
         */
        $scope.initializeSession = function () {
            $scope.authenticated = AuthService.isAuthenticated();
            if (AuthService.isAuthenticated()) {
                getUser();
            }
        };

        // Initialize session
        $scope.initializeSession();
    }]);
