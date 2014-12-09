'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$location', '$translate', 'AuthService', 'Storage', 'User', 'Auth', function ($scope, $location, $translate, AuthService, Storage, User, Auth) {

        $scope.logout = function () {
            Storage.destroySession();
            User.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $location.path('/');
        };

        $scope.currentLanguage = $translate.preferredLanguage();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
            });
        };


        var auth = {};
        var logout = function(){
            console.log('*** LOGOUT');
            auth.loggedIn = false;
            auth.authz = null;
            window.location = auth.logoutUrl;
        };

        $scope.login = function () {
            var keycloakAuth = new Keycloak('../../keycloak.json');
            auth.loggedIn = false;

            auth.promise = keycloakAuth.init({ onLoad: 'login-required' });
            auth.promise.success(function () {
                auth.loggedIn = true;
                auth.authz = keycloakAuth;
                auth.logoutUrl = keycloakAuth.authServerUrl + "/realms/ortolang/tokens/logout?redirect_uri=/market";
                Auth.setAuth(auth);

//                angular.bootstrap(document, ["ortolangMarketApp"]);
            }).error(function () {
                    window.location.reload();
                });
        };
    }]);
