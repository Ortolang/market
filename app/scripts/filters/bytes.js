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
    .filter('bytes', function () {
        return function (bytes, precision) {
            if (bytes === 0) {
                return '0 bytes';
            }
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
                return '-';
            }
            if (precision === undefined) {
                precision = 1;
            }

            var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024)),
                val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);

            return (val.match(/\.0*$/) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
        };
    });
