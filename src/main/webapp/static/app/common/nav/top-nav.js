'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$translate', 'AuthService', 'User', 'Runtime', function ($scope, $translate, AuthService, User, Runtime) {

        $scope.navbarCollapsed = false;
        $scope.User = User;

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
            if (AuthService.isAuthenticated()) {
                $translate.use(User.getFavoriteLanguage()).then(function (language) {
                    $scope.currentLanguage = language;
                });
            } else if (localStorage !== undefined) {
                var storedLanguage = localStorage.getItem('language');
                if (storedLanguage === 'fr' || storedLanguage === 'en') {
                    $translate.use(storedLanguage);
                    return storedLanguage;
                }
            }
        }

        AuthService.sessionInitialized().then(function () {
            initLanguage();
        });

        $scope.$on('askLanguageChange', function ($event, langKey) {
            $scope.changeLanguage(langKey);
        });

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
                storeLanguage();
            });
        };

    }]);
