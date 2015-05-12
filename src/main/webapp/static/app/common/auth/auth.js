'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$route', 'User', 'AuthService', 'ProfileResource', 'AtmosphereService', function ($scope, $route, User, AuthService, ProfileResource, AtmosphereService) {

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
                ProfileResource.getInfos({key: profile.key}).$promise.then(
                    function success(data) {
                        profile.avatarIds = [];
                        profile.profileDatas = {};
                        angular.forEach(data.entries, function (profileData) {
                            profile.profileDatas[profileData.name] = profileData;
                        });
                        User.create(profile);
                        User.avatarIds = {};
                        angular.forEach(avatarIds, function (avatarId) {
                            var itemSetting = User.getProfileData(avatarId.name);
                            User.avatarIds[avatarId.id] = avatarId;
                            if (itemSetting) {
                                User.avatarIds[avatarId.id].value = itemSetting.value;
                            }
                        });
                        var favoriteAvatar = User.getProfileData('avatar');
                        User.favoriteAvatar = favoriteAvatar ? favoriteAvatar.value : 'GITHUB';
                        AuthService.resolveSessionInitialized();
                        AtmosphereService.subscribe();
                    },
                    function error() {
                        profile.avatarIds = avatarIds;
                        User.create(profile);
                        AuthService.resolveSessionInitialized();
                        AtmosphereService.subscribe();
                    }
                );
            });
        }

        $scope.$on('updateDefaultAvatar', function (event, data) {
            User.favoriteAvatar = data;
            event.stopPropagation();
        });

        $scope.footerPath = function () {
            return $route.current && $route.current.originalPath === '/workspaces' ? '' : 'common/nav/footer.html';
        };

        function initializeSession() {
            $scope.authenticated = AuthService.isAuthenticated();
            if (AuthService.isAuthenticated()) {
                getUser();
            }
        }

        initializeSession();
    }]);
