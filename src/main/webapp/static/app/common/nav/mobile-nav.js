'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MobileNavCtrl
 * @description
 * # MobileNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MobileNavCtrl', ['$scope', 'Helper', 'sideNavElements', 'Runtime', 'AuthService', 'Settings', function ($scope, Helper, sideNavElements, Runtime, AuthService, Settings) {

        $scope.sideNavElements = sideNavElements;
        $scope.Runtime = Runtime;
        $scope.language = Settings.language;

        $scope.login = function () {
            AuthService.login();
        };

        $scope.logout = function () {
            AuthService.logout();
        };

        $scope.changeLanguage = function (language) {
            $scope.$root.$broadcast('askLanguageChange', language);
            Helper.hideAsideMobileNav();
        };

        $scope.authenticated = AuthService.isAuthenticated();
    }]);
