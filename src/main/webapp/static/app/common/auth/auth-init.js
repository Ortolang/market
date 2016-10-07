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
            .factory('AuthService', ['$window', '$q', '$translate', function ($window, $q, $translate) {

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
                    /*jshint camelcase:false */
                    return keycloakAuth.idTokenParsed.preferred_username === 'root';
                }

                function isAdmin() {
                    return keycloakAuth.hasRealmRole('admin');
                }

                function getScope() {
                    if (keycloakAuth.authenticated) {
                        /*jshint camelcase:false */
                        return window.btoa(keycloakAuth.idTokenParsed.preferred_username) + OrtolangConfig.cacheVersion;
                    }
                    return window.btoa('anonymous') + OrtolangConfig.cacheVersion;
                }

                function login() {
                    $window.location = keycloakAuth.createLoginUrl() + '&kc_locale=' + $translate.use();
                }

                function register() {
                    $window.location = keycloakAuth.createLoginUrl({action: 'register'}) + '&kc_locale=' + $translate.use();
                }

                function account() {
                    $window.location = keycloakAuth.createAccountUrl() + '&kc_locale=' + $translate.use();
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
