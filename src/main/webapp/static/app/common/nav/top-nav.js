'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', ['$rootScope', '$scope', '$location', '$translate', '$swipe', 'AuthService', 'User', 'Settings', 'Runtime', 'amMoment', 'StaticWebsite', 'Cart', 'Helper',
        function ($rootScope, $scope, $location, $translate, $swipe, AuthService, User, Settings, Runtime, amMoment, StaticWebsite, Cart, Helper) {

            $scope.User = User;
            $scope.Settings = Settings;
            $scope.Runtime = Runtime;
            $scope.Cart = Cart;
            $scope.StaticWebsite = StaticWebsite;

            $scope.login = function () {
                AuthService.login();
            };

            $scope.account = function () {
                AuthService.account();
            };

            $scope.register = function () {
                AuthService.register();
            };

            $scope.logout = function () {
                AuthService.logout();
            };

            $scope.showMobileNav = function () {
                Helper.showAsideMobileNav();
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
                if (!favoriteLanguage && $location.search().lang && ($location.search().lang === 'fr' || $location.search().lang === 'en')) {
                    favoriteLanguage = {value: $location.search().lang};
                    $location.search('lang', undefined);
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
                amMoment.changeLocale(Settings.language, {});
                $rootScope.$emit('languageInitialized', favoriteLanguage || Settings.language);
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

            var touchStart;

            if (Helper.isMobile()) {
                $swipe.bind(angular.element('body'), {
                    start:  function (coordinates) {
                        touchStart = coordinates;
                    },
                    move: function (coordinates) {
                        if (touchStart && touchStart.x < 20 && coordinates.x > touchStart.x + 100 && Math.abs(coordinates.y - touchStart.y) < 50) {
                            Helper.showAsideMobileNav();
                            touchStart = undefined;
                        } else if (touchStart && coordinates.x + 100 < touchStart.x && Math.abs(coordinates.y - touchStart.y) < 50) {
                            Helper.hideAsideMobileNav();
                            touchStart = undefined;
                        }
                    },
                    end: function () {
                        touchStart = undefined;
                    }
                });
            }

            $scope.changeLanguage = function (langKey) {
                $translate.use(langKey).then(function (langKey) {
                    Settings.language = langKey;
                    Settings.store();
                    amMoment.changeLocale(langKey, {});
                });
            };

        }]);
