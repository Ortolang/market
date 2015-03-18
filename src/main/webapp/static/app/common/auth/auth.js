'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$route', 'User', 'AuthService', 'ProfileResource', '$filter', function ($scope, $route, User, AuthService, ProfileResource, $filter) {

        function getUser() {
            ProfileResource.connected().$promise.then(function (profile) {
                if (!profile.complete) {
                    profile.key = AuthService.getKeycloak().idTokenParsed.preferred_username;
                    profile.givenName = AuthService.getKeycloak().idTokenParsed.given_name;
                    profile.familyName = AuthService.getKeycloak().idTokenParsed.family_name;
                    profile.email = AuthService.getKeycloak().idTokenParsed.email;
                    ProfileResource.put({}, profile);
                }
                // INIT avatar & settings
                var avatarIds = [
                    { id: '1', name: 'facebook', value: ''},
                    //{ id: '2', name: 'twitter', value: ''},
                    { id: '3', name: 'github', value: profile.key},
                    { id: '4', name: 'gravatar', value: profile.email}
                ];
                profile.favoriteAvatar = '0';
                profile.avatarIds = [];
                ProfileResource.getSettings({userId: profile.key}).$promise.then(
                    function success(settings) {
                        angular.forEach(settings, function(setting) {
                            if(setting.name === 'avatar') {
                                profile.favoriteAvatar = setting.value;
                            }
                        });
                        angular.forEach(avatarIds, function(avatarId) {
                            var itemSetting = $filter('filter')(settings, {name: avatarId.name}, true);
                            if (itemSetting.length <= 0) {
                                profile.avatarIds.push(avatarId);
                            } else {
                                profile.avatarIds.push({id: avatarId.id, name: avatarId.name, value: itemSetting[0].value});
                            }
                        });
                        $scope.currentUser = User.create(profile);
                    },
                    function error() {
                        profile.avatarIds = avatarIds;
                        $scope.currentUser = User.create(profile);
                    }
                );
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

        $scope.footerPath = function () {
            return $route.current && $route.current.originalPath === '/workspaces' ? '' : 'common/nav/footer.html';
        };

        // Initialize session
        $scope.initializeSession();
    }]);
