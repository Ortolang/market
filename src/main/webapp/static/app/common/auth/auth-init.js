'use strict';

angular.element(document).ready(function () {
    var keycloakAuth = new Keycloak(OrtolangConfig.keycloakConfigLocation);

    function keycloackInitCallback() {
        /**
         * @ngdoc service
         * @name ortolangMarketApp.AuthService
         * @description
         * # AuthService
         * Factory in the ortolangMarketApp.
         */
        angular.module('ortolangMarketApp')
            .factory('AuthService', ['$window', '$q', function ($window, $q) {

                var logoutUrl = keycloakAuth.authServerUrl + '/realms/ortolang/tokens/logout?redirect_uri=' + OrtolangConfig.logoutRedirectUrl,
                    deferred = $q.defer();

                function isAuthenticated() {
                    return keycloakAuth.authenticated;
                }

                function isSuperUser() {
                    return isAuthenticated() && keycloakAuth.tokenParsed.preferred_username === 'root';
                }

                function login() {
                    $window.location = keycloakAuth.createLoginUrl();
                }

                function register() {
                    $window.location = keycloakAuth.createLoginUrl();
                }

                function logout() {
                    $window.location = logoutUrl;
                }

                function forceReload() {
                    $window.location.reload();
                }

                function sessionInitialized() {
                    return deferred.promise;
                }

                function resolveSessionInitialized() {
                    deferred.resolve();
                }

                return {
                    login: login,
                    register: register,
                    logout: logout,
                    getToken: function () { return keycloakAuth.token; },
                    getKeycloak: function () { return keycloakAuth; },
                    isAuthenticated: isAuthenticated,
                    forceReload: forceReload,
                    isSuperUser: isSuperUser,
                    sessionInitialized: sessionInitialized,
                    resolveSessionInitialized: resolveSessionInitialized
                };
            }]);

        angular.bootstrap(document, ['ortolangMarketApp'], { strictDi: true });
    }

    keycloakAuth.init({ onLoad: 'check-sso' }).success(function () {
        keycloackInitCallback();
    }).error(function () {
        keycloackInitCallback();
    });
});
