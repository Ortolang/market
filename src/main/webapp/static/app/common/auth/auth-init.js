'use strict';

angular.element(document).ready(function () {
    var keycloakAuth = new Keycloak('keycloak.json');
    keycloakAuth.init({ onLoad: 'check-sso' }).success(function () {
        /**
         * @ngdoc service
         * @name ortolangMarketApp.AuthService
         * @description
         * # AuthService
         * Factory in the ortolangMarketApp.
         */
        angular.module('ortolangMarketApp')
            .factory('AuthService', ['$window', function ($window) {

                var logoutUrl = keycloakAuth.authServerUrl + '/realms/ortolang/tokens/logout?redirect_uri=' + logoutRedirectUrl;

                function isAuthenticated() {
                    return keycloakAuth.authenticated;
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

                return {
                    login: login,
                    register: register,
                    logout: logout,
                    getToken: function () { return keycloakAuth.token; },
                    getKeycloak: function () { return keycloakAuth; },
                    isAuthenticated: isAuthenticated
                };
            }]);

        angular.bootstrap(document, ['ortolangMarketApp'], { strictDi: true });
    }).error(function (error) {
        console.error('An error occurred while initializing Keycloak', error);
    });
});
