'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:cookiesConsent
 * @description
 * # cookiesConsent
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('cookiesConsent', ['$rootScope', '$cookies', '$alert', function ($rootScope, $cookies, $alert) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (!$cookies.get('ORTOLANG_COOKIES_CONSENT')) {
                    var cookieAlert = $alert({
                        templateUrl: 'cookies-consent.html',
                        placement: 'bottom',
                        container: element,
                        dismissable: false
                    });

                    $rootScope.cookieConsent = function () {
                        var expiringDate = new Date();
                        expiringDate.setFullYear(expiringDate.getFullYear() + 1);
                        $cookies.put('ORTOLANG_COOKIES_CONSENT', true, {
                            expires: expiringDate.toISOString()
                        });
                        cookieAlert.hide();
                    };
                }
            }
        };
    }]);
