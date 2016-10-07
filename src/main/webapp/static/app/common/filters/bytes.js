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
            var units,
                number = Math.floor(Math.log(bytes) / Math.log(1024)),
                val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
            if ($translate.use() === 'fr') {
                units =  ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po'];
            } else {
                units =  ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
            }
            return (/\.0*$/.test(val) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
        };
    }]);
