'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$translate', 'AuthService', 'User', 'Runtime', 'sideNavElements', 'Settings', 'amMoment', 'StaticWebsite',
        function ($scope, $translate, AuthService, User, Runtime, sideNavElements, Settings, amMoment, StaticWebsite) {

        $scope.sideNavElements = sideNavElements;
        $scope.navbarCollapsed = false;
        $scope.User = User;
        $scope.Settings = Settings;
        $scope.Runtime = Runtime;
        $scope.StaticWebsite = StaticWebsite;
            console.debug($scope.StaticWebsite);

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

        function initLanguage() {
            var favoriteLanguage;
            if (AuthService.isAuthenticated()) {
                favoriteLanguage = User.getProfileData('language');
            }
            if (Settings.language && Settings.language !== 'fr' && Settings.language !== 'en') {
                Settings.language = undefined;
            }
            if (favoriteLanguage || Settings.language) {
                $translate.use(favoriteLanguage ? favoriteLanguage.value : Settings.language).then(function (language) {
                    Settings.language = language;
                });
            } else {
                Settings.language = $translate.use();
            }
            amMoment.changeLocale(Settings.language);
        }

        // *************** //
        //  Site statique  //
        // *************** //

        if (AuthService.isAuthenticated()) {
            AuthService.sessionInitialized().then(function () {
                initLanguage();
            });
        } else {
            initLanguage();
        }

        $scope.$on('askLanguageChange', function (event, langKey) {
            $scope.changeLanguage(langKey);
            //$scope.staticMenu =
        });

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                Settings.language = langKey;
                Settings.store();
                amMoment.changeLocale(langKey);
            });
        };

    }]);
