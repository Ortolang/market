'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$translate', 'AuthService', 'Runtime', function ($scope, $translate, AuthService, Runtime) {

        $scope.navbarCollapsed = false;

        $scope.toggleNavbar = function () {
            $scope.navbarCollapsed = !$scope.navbarCollapsed;
        };

        $scope.login = function () {
            AuthService.login();
        };

        $scope.register = function () {
            AuthService.register();
        };

        $scope.logout = function () {
            AuthService.logout();
        };

        $scope.currentLanguage = $translate.use();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
            });
        };

    }]);
