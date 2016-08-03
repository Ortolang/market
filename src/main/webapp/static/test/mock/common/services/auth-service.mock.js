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
                authenticated: true,
                isTokenExpired: function () {return false; }
            },
            deferred = $q.defer(),
            logoutUrl = keycloakAuth.authServerUrl + '/realms/ortolang/tokens/logout?redirect_uri=https://localhost:9000/';

        deferred.resolve();

        function isAuthenticated() {
            return keycloakAuth.authenticated;
        }

        function getScope() {
            if (keycloakAuth.authenticated) {
                return window.btoa('username') + OrtolangConfig.cacheVersion;
            }
            return OrtolangConfig.cacheVersion;
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

        function resolveSessionInitialized() {
            deferred.resolve();
        }

        return {
            login: login,
            logout: logout,
            register: register,
            getToken: function () { return keycloakAuth.token; },
            getScope: getScope,
            getKeycloak: function () { return keycloakAuth; },
            isAuthenticated: isAuthenticated,
            sessionInitialized: sessionInitialized,
            resolveSessionInitialized: resolveSessionInitialized
        };
    }]);
