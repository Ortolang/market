'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:cookiesConsent
 * @description
 * # cookiesConsent
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('cookiesConsent', ['$rootScope', '$cookies', '$alert', 'AuthService', function ($rootScope, $cookies, $alert, AuthService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                function showCookieAlert() {
                    var cookieAlert = $alert({
                        templateUrl: 'cookies-consent.html',
                        placement: 'bottom',
                        container: element,
                        dismissable: false
                    });

                    $rootScope.cookieConsent = function () {
                        if (localStorage !== undefined) {
                            localStorage.setItem('ortolang.cookies.consent', true);
                        } else {
                            var expiringDate = new Date();
                            expiringDate.setFullYear(expiringDate.getFullYear() + 1);
                            $cookies.put('ortolang.cookies.consent', 'true', {
                                expires: expiringDate.toISOString()
                            });
                        }
                        cookieAlert.hide();
                    };
                }
                if (!/Prerender/.test(navigator.userAgent) && !AuthService.isAuthenticated()) {
                    if (localStorage !== undefined) {
                        if (!localStorage.getItem('ortolang.cookies.consent')) {
                            showCookieAlert();
                        }
                    } else {
                        if (!$cookies.get('ortolang.cookies.consent')) {
                            showCookieAlert();
                        }
                    }
                }
            }
        };
    }]);
