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

        // *********************** //
        //        Language         //
        // *********************** //

        function storeLanguage() {
            if (localStorage !== undefined) {
                localStorage.setItem('language', $scope.currentLanguage);
            }
        }

        function initLanguage() {
            if (localStorage !== undefined) {
                var storedLanguage = localStorage.getItem('language');
                if (storedLanguage === 'fr' || storedLanguage === 'en') {
                    $translate.use(storedLanguage);
                    return storedLanguage;
                }
            }
            return $translate.use();
        }

        $scope.currentLanguage = initLanguage();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
                storeLanguage();
            });
        };

    }]);
