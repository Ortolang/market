'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketAppMock.AuthService
 * @description
 * # AuthService
 * Factory in the ortolangMarketAppMock.
 */
angular.module('ortolangMarketAppMock')
    .factory('AuthService', ['$window', '$q', function ($window, $q) {

        var keycloakAuth = {
                authServerUrl: 'authServerUrl',
                createLoginUrl: 'createLoginUrl',
                createAccountUrl: 'createAccountUrl',
                token: 'token',
                authenticated: true
            },
            deferred = $q.defer(),
            logoutUrl = keycloakAuth.authServerUrl + '/realms/ortolang/tokens/logout?redirect_uri=https://localhost:9000/';

        deferred.resolve();

        function isAuthenticated() {
            return keycloakAuth.authenticated;
        }

        function login() {
            $window.location = keycloakAuth.createLoginUrl;
        }

        function register() {
            $window.location = keycloakAuth.createAccountUrl;
        }

        function logout() {
            $window.location = logoutUrl;
        }

        function sessionInitialized() {
            return deferred.promise;
        }

        return {
            login: login,
            logout: logout,
            register: register,
            getToken: function () { return keycloakAuth.token; },
            getKeycloak: function () { return keycloakAuth; },
            isAuthenticated: isAuthenticated,
            sessionInitialized: sessionInitialized
        };
    }]);
