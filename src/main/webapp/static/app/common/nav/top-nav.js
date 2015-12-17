'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', ['$rootScope', '$scope', '$translate', 'AuthService', 'User', 'sideNavElements', 'Settings', 'amMoment', 'StaticWebsite', 'Cart',
        function ($rootScope, $scope, $translate, AuthService, User, sideNavElements, Settings, amMoment, StaticWebsite, Cart) {

            $scope.sideNavElements = sideNavElements;
            $scope.navbarCollapsed = false;
            $scope.User = User;
            $scope.Settings = Settings;
            $scope.Cart = Cart;
            //$scope.Runtime = Runtime;
            $scope.StaticWebsite = StaticWebsite;

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
                var favoriteLanguage,
                    currentLanguage = $translate.use();
                if (AuthService.isAuthenticated()) {
                    favoriteLanguage = User.getProfileData('language');
                }
                if (Settings.language && Settings.language !== 'fr' && Settings.language !== 'en') {
                    Settings.language = undefined;
                }
                if (favoriteLanguage || Settings.language) {
                    favoriteLanguage = favoriteLanguage ? favoriteLanguage.value : Settings.language;
                    if (favoriteLanguage !== currentLanguage) {
                        $translate.use(favoriteLanguage).then(function (language) {
                            Settings.language = language;
                        });
                    }
                } else {
                    Settings.language = $translate.use();
                }
                amMoment.changeLocale(Settings.language);
                $rootScope.$emit('languageInitialized', Settings.language);
            }

            if (AuthService.isAuthenticated()) {
                AuthService.sessionInitialized().then(function () {
                    initLanguage();
                });
            } else {
                initLanguage();
            }

            $scope.$on('askLanguageChange', function (event, langKey) {
                $scope.changeLanguage(langKey);
            });

            $scope.changeLanguage = function (langKey) {
                $translate.use(langKey).then(function (langKey) {
                    Settings.language = langKey;
                    Settings.store();
                    amMoment.changeLocale(langKey);
                });
            };

        }]);
