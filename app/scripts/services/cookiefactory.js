'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.CookieFactory
 * @description
 * # CookieFactory
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('CookieFactory', function ($q, $timeout) {

        return {
            /**
             * Get a cookie by its name
             * @param name
             * @returns {*}
             */
            getCookie: function (name) {
                var deferred = $q.defer();
                // Used to un-stringify value of cookie
                $.cookie.json = true;

                $timeout(function () {
                    deferred.resolve($.cookie(name));
                }, 0);

                return deferred.promise;
            },

            /**
             * Get all cookies
             * @returns {undefined|The}
             */
            getAllCookies: function () {
                return $.cookie();
            },

            /**
             * Create a cookie
             * @param name
             * @param value
             * @param expiration
             * @returns {undefined|The}
             */
            setCookie: function (name, value, expiration) {
                expiration = angular.isDefined(expiration) ? expiration : 7;
                // Used to stringify value of cookie
                $.cookie.json = true;
                return $.cookie(name, value, { expires: expiration });
            },

            /**
             * Delete a cookie by its name
             * @param name
             * @returns {*}
             */
            deleteCookie: function (name) {
                return $.removeCookie(name);
            }
        };
    });
