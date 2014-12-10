'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$location', '$window', '$translate', 'AuthService', 'Storage', 'User', 'Auth', function ($scope, $location, $window, $translate, AuthService, Storage, User, Auth) {

        $scope.logout = function () {
            $window.location = Auth.getLogoutUrl();
            //Storage.destroySession();
            //User.destroy();
            //$scope.setCurrentUser(null);
            //$scope.setAuthenticated(AuthService.isAuthenticated());
            //$location.path('/');
        };

        $scope.currentLanguage = $translate.preferredLanguage();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
            });
        };

        $scope.login = function () {
            $window.location = Auth.getKeycloak().createLoginUrl();
        };
    }]);
