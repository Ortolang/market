'use strict';

angular.element(document).ready(function () {

    var keycloakAuth = new Keycloak(OrtolangConfig.keycloakConfigLocation);

    function keycloakInitCallback() {
        /**
         * @ngdoc service
         * @name ortolangMarketApp.AuthService
         *
         * @description
         * # AuthService
         * Factory in the ortolangMarketApp.
         */
        angular.module('ortolangMarketApp')
            .factory('AuthService', ['$window', '$q', function ($window, $q) {

                var deferred = $q.defer();

                /**
                 * @ngdoc function
                 * @name ortolangMarketApp.AuthService#isAuthenticated
                 * @methodOf ortolangMarketApp.AuthService
                 *
                 * @description
                 * Is user authenticated on Keycloak server
                 *
                 * @returns {boolean}
                 */
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
                    $window.location = keycloakAuth.createLogoutUrl();
                }

                function forceReload() {
                    $window.location.reload();
                }

                /**
                 * @ngdoc function
                 * @name ortolangMarketApp.AuthService#sessionInitialized
                 * @methodOf ortolangMarketApp.AuthService
                 *
                 * @returns {Promise} a promise resolved once the user profile is fully loaded
                 */
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
                    sessionInitialized: sessionInitialized,
                    resolveSessionInitialized: resolveSessionInitialized
                };
            }]);

        angular.bootstrap(document, ['ortolangMarketApp'], { strictDi: true });
    }

    keycloakAuth.init({ onLoad: 'check-sso' }).success(function () {
        keycloakInitCallback();
    }).error(function () {
        keycloakInitCallback();
    });
});
