'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:bytes
 * @function
 * @description
 * # Bytes format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('bytes', ['$translate', function ($translate) {
        return function (bytes, precision) {
            if (angular.isUndefined(bytes)) {
                return undefined;
            }
            if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '-';
            }
            if (precision === undefined) {
                precision = 1;
            }
            var units, result,
                number = Math.floor(Math.log(bytes) / Math.log(1000)),
                val = (bytes / Math.pow(1000, Math.floor(number))).toFixed(precision);
            if ($translate.use() === 'fr') {
                units =  ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po'];
            } else {
                units =  ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
            }
            result = (/\.0*$/.test(val) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
            if ($translate.use() === 'fr') {
                result = result.replace('.', ',');
            }
            return result;
        };
    }]);
