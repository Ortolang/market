'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:removeAccents
 * @function
 * @description
 * # removeAccents
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('removeAccents', function () {

        return function (source) {
            var accent = [
                    /[\300-\306]/g, /[\340-\346]/g, // A, a
                    /[\310-\313]/g, /[\350-\353]/g, // E, e
                    /[\314-\317]/g, /[\354-\357]/g, // I, i
                    /[\322-\330]/g, /[\362-\370]/g, // O, o
                    /[\331-\334]/g, /[\371-\374]/g, // U, u
                    /[\321]/g, /[\361]/g, // N, n
                    /[\307]/g, /[\347]/g // C, c
                ],
                noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'],
                i;

            for (i = 0; i < accent.length; i++) {
                source = source.replace(accent[i], noaccent[i]);
            }

            return source;
        };
    });
