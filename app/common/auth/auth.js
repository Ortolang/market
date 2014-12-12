'use strict';

angular.element(document).ready(function () {
    var keycloakAuth = new Keycloak('../../keycloak.json');
    keycloakAuth.init({ onLoad: 'check-sso' }).success(function () {
        /**
         * @ngdoc service
         * @name ortolangMarketApp.Auth
         * @description
         * # Auth
         * Factory in the ortolangMarketApp.
         */
        angular.module('ortolangMarketApp')
            .factory('Auth', function() {
                var logoutUrl = keycloakAuth.authServerUrl + "/realms/ortolang/tokens/logout?redirect_uri=https://localhost:9000/";
                function isAuthenticated() {
                    return keycloakAuth.authenticated;
                }
                return {
                    getToken: function () { return keycloakAuth.token; },
                    getKeycloak: function () { return keycloakAuth; },
                    isAuthenticated: isAuthenticated,
                    getLogoutUrl: function () { return logoutUrl; }
                };
            });
        angular.bootstrap(document, ["ortolangMarketApp"]);
    }).error(function () {
        window.location.reload();
    });
});
