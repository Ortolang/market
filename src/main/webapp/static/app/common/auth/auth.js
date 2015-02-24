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
                if (!profile.complete) {
                    profile.key = AuthService.getKeycloak().idTokenParsed.preferred_username;
                    profile.givenName = AuthService.getKeycloak().idTokenParsed.given_name;
                    profile.familyName = AuthService.getKeycloak().idTokenParsed.family_name;
                    profile.email = AuthService.getKeycloak().idTokenParsed.email;
                    ProfileResource.put({}, profile);
                }
                $scope.currentUser = User.create(profile);
            });
        }

        /**
         * Update default avatar
         */
        $scope.$on('updateDefaultAvatar', function(event, data) {
            $scope.currentUser.favoriteAvatar = data;
        });

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
