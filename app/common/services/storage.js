'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Storage
 * @description
 * # Storage
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Storage', ['CookieFactory', function (CookieFactory) {

        return {
            /**
             * Get current session
             * @returns {*}
             */
            getSession: function () {
                return CookieFactory.getCookie('currentUser');
            },
            /**
             * Get current session
             * @param value
             * @param expiration
             * @returns {undefined}
             */
            setSession: function (value, expiration) {
                return CookieFactory.setCookie('currentUser', value, expiration);
            },
            /**
             * Destroy current session
             * @returns {*}
             */
            destroySession: function () {
                return CookieFactory.deleteCookie('currentUser');
            }
        };
    }]);
