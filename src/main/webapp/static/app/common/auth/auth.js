'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$route', 'User', 'AuthService', 'ProfileResource', '$translate', function ($scope, $route, User, AuthService, ProfileResource, $translate) {

        function getUser() {
            ProfileResource.connected().$promise.then(function (profile) {
                if (!profile.complete) {
                    profile.key = AuthService.getKeycloak().idTokenParsed.preferred_username;
                    profile.givenName = AuthService.getKeycloak().idTokenParsed.given_name;
                    profile.familyName = AuthService.getKeycloak().idTokenParsed.family_name;
                    profile.email = AuthService.getKeycloak().idTokenParsed.email;
                    ProfileResource.put({}, profile);
                }
                User.preInit(profile);
                var avatarIds = {
                    'FACEBOOK': {id: 'FACEBOOK', name: 'facebook', value: ''},
                    //{ id: 'TWITTER', name: 'twitter', value: ''},
                    'GITHUB': {id: 'GITHUB', name: 'github', value: profile.key},
                    'GRAVATAR': {id: 'GRAVATAR', name: 'gravatar', value: profile.email}
                };
                profile.favoriteAvatar = '0';
                ProfileResource.getInfos({key: profile.key}).$promise.then(
                    function success(data) {
                        profile.infos = [];
                        profile.settings = [];
                        profile.aboutme = [];
                        profile.avatarIds = [];
                        angular.forEach(data.entries, function (profileData) {
                            var profileDataName = profileData.name.split('.');
                            switch (profileDataName[0]) {
                                case 'infos':
                                    profile.infos.push(profileData);
                                    break;
                                case 'settings':
                                    profile.settings.push(profileData);
                                    break;
                                case 'aboutme':
                                    profile.aboutme.push(profileData);
                                    break;
                            }
                        });
                        User.create(profile);
                        User.avatarIds = {};
                        angular.forEach(avatarIds, function (avatarId) {
                            var itemSetting = User.getProfileData('settings', avatarId.name);
                            if (itemSetting) {
                                User.avatarIds[avatarId.id] = {
                                    id: avatarId.id,
                                    name: avatarId.name,
                                    value: itemSetting.value
                                };
                            } else {
                                User.avatarIds[avatarId.id] = avatarId;
                            }
                        });
                        var favoriteAvatar = User.getProfileData('settings', 'avatar');
                        User.favoriteAvatar = favoriteAvatar ? favoriteAvatar.value : 'GITHUB';
                        AuthService.resolveSessionInitialized();
                    },
                    function error() {
                        profile.avatarIds = avatarIds;
                        User.create(profile);
                        AuthService.resolveSessionInitialized();
                    }
                );
            });
        }

        /**
         * Update default avatar
         */
        $scope.$on('updateDefaultAvatar', function (event, data) {
            User.favoriteAvatar = data;
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
