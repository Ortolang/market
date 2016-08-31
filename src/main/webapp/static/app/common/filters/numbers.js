'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:numbers
 * @function
 * @description
 * # numbers format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('numbers', function () {

        return function (number, language) {
            console.log(language);
            if (!number) {
                return;
            }
            var delimiter = ' ';
            if (language === 'en') {
                delimiter = ',';
            }
            var str = number.toString().split('.');
            if (str[0].length >= 5) {
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1' + delimiter);
            }
            if (str[1] && str[1].length >= 5) {
                str[1] = str[1].replace(/(\d{3})/g, '$1 ');
            }
            return str.join('.');
        };
    });
