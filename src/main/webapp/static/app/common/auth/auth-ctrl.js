'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 *
 * @extends $rootScope.Scope
 *
 * @property {boolean} authenticated    - Shortcut for {@link ortolangMarketApp.AuthService#isAuthenticated}
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$modal', 'url', 'User', 'AuthService', 'ProfileResource', 'AtmosphereService', 'Runtime', function (/** ortolangMarketApp.controller:AuthCtrl */$scope, $rootScope, $http, $modal, url, User, AuthService, ProfileResource, AtmosphereService, Runtime) {

        var serverDownModal, unauthorizedModal, notLoggedInModal;

        function initProfile(profile) {
            User.create(profile);
            if (User.isModerator) {
                Runtime.init();
            }
            AuthService.resolveSessionInitialized();
            AtmosphereService.subscribe();
        }

        function getUser() {
            ProfileResource.connected().$promise.then(function (profile) {
                if (!profile.complete) {
                    /*jshint camelcase:false */
                    profile.key = AuthService.getKeycloak().idTokenParsed.preferred_username;
                    profile.givenName = AuthService.getKeycloak().idTokenParsed.given_name;
                    profile.familyName = AuthService.getKeycloak().idTokenParsed.family_name;
                    profile.email = AuthService.getKeycloak().idTokenParsed.email;
                    ProfileResource.updateProfile({}, profile);
                }
                User.preInit(profile);
                ProfileResource.getInfos({key: profile.key}).$promise.then(
                    function (data) {
                        profile.profileDatas = {};
                        angular.forEach(data.entries, function (profileData) {
                            profile.profileDatas[profileData.name] = profileData;
                        });
                        initProfile(profile);
                    },
                    function () {
                        initProfile(profile);
                    }
                );
            });
        }

        $scope.$on('server-down', function () {
            if (angular.element('.server-down-modal').length === 0) {
                $http.get(url.api + '/config/ping').then(function () {
                    console.log('API server responded to ping');
                }, function () {
                    if (!serverDownModal) {
                        var modalScope = $scope.$new(true);
                        modalScope.refresh = function () {
                            AuthService.forceReload();
                        };
                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                            serverDownModal = undefined;
                        });
                        serverDownModal = $modal({
                            scope: modalScope,
                            templateUrl: 'common/auth/templates/server-down-modal.html'
                        });
                    }
                });
            }
        });

        function unauthorized() {
            if (angular.element('.unauthorized-modal').length === 0) {
                if (!unauthorizedModal) {
                    var modalScope = $scope.$new(true);
                    modalScope.refresh = function () {
                        AuthService.forceReload();
                    };
                    modalScope.$on('modal.hide', function () {
                        modalScope.$destroy();
                        unauthorizedModal = undefined;
                    });
                    unauthorizedModal = $modal({
                        scope: modalScope,
                        templateUrl: 'common/auth/templates/unauthorized-modal.html'
                    });
                }
            }
        }

        function notLoggedIn() {
            if (angular.element('.not-logged-in-modal').length === 0) {
                if (!notLoggedInModal) {
                    var modalScope = $scope.$new(true);
                    modalScope.login = function () {
                        AuthService.login();
                    };
                    modalScope.$on('modal.hide', function () {
                        modalScope.$destroy();
                        notLoggedInModal = undefined;
                    });
                    notLoggedInModal = $modal({
                        scope: modalScope,
                        templateUrl: 'common/auth/templates/not-logged-in-modal.html'
                    });
                }
            }
        }

        $scope.$on('unauthorized-user', function () {
            if (AuthService.isAuthenticated()) {
                unauthorized();
            } else {
                notLoggedIn();
            }
        });

        function initializeSession() {
            $scope.authenticated = AuthService.isAuthenticated();
            if (AuthService.isAuthenticated()) {
                getUser();
            }
        }

        initializeSession();
    }]);
