'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$translate', 'AuthService', function ($scope, $translate, AuthService) {

        $scope.login = function () {
            AuthService.login();
        };

        $scope.register = function () {
            AuthService.register();
        };

        $scope.logout = function () {
            AuthService.logout();
        };

        $scope.currentLanguage = $translate.preferredLanguage();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
            });
        };

    }]);
