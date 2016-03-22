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
            .factory('AuthService', ['$window', '$q', 'Settings', function ($window, $q, Settings) {

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

                function isRoot() {
                    return keycloakAuth.idTokenParsed.preferred_username === 'root';
                }

                function isAdmin() {
                    return keycloakAuth.hasRealmRole('admin');
                }

                function getScope() {
                    if (keycloakAuth.authenticated) {
                        return window.btoa(keycloakAuth.idTokenParsed.preferred_username);
                    }
                }

                function login() {
                    $window.location = keycloakAuth.createLoginUrl() + '&kc_locale=' + Settings.language;
                }

                function register() {
                    $window.location = keycloakAuth.createLoginUrl({action: 'register'}) + '&kc_locale=' + Settings.language;
                }

                function account() {
                    $window.location = keycloakAuth.createAccountUrl() + '&kc_locale=' + Settings.language;
                }

                function logout() {
                    $window.location = keycloakAuth.createLogoutUrl({redirectUri: $window.location.origin});
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
                    account: account,
                    getToken: function () { return keycloakAuth.token; },
                    getKeycloak: function () { return keycloakAuth; },
                    isAuthenticated: isAuthenticated,
                    isRoot: isRoot,
                    isAdmin: isAdmin,
                    getScope: getScope,
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
