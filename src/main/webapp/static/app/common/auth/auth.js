'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$rootScope', '$modal', 'User', 'AuthService', 'ProfileResource', 'AtmosphereService', function ($scope, $rootScope, $modal, User, AuthService, ProfileResource, AtmosphereService) {

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
                ProfileResource.getInfos({key: profile.key}).$promise.then(
                    function success(data) {
                        profile.profileDatas = {};
                        angular.forEach(data.entries, function (profileData) {
                            profile.profileDatas[profileData.name] = profileData;
                        });
                        User.create(profile);
                        AuthService.resolveSessionInitialized();
                        AtmosphereService.subscribe();
                    },
                    function error() {
                        User.create(profile);
                        AuthService.resolveSessionInitialized();
                        AtmosphereService.subscribe();
                    }
                );
            });
        }

        $scope.$on('server-down', function () {
            if (angular.element('.server-down-modal').length === 0) {
                var modalScope = $rootScope.$new(true);
                modalScope.refresh = function () {
                    AuthService.forceReload();
                };
                $modal({
                    scope: modalScope,
                    template: 'common/auth/templates/server-down-modal.html'
                });
            }
        });

        $rootScope.noFooter = false;

        function initializeSession() {
            $scope.authenticated = AuthService.isAuthenticated();
            if (AuthService.isAuthenticated()) {
                getUser();
            }
        }

        initializeSession();
    }]);
