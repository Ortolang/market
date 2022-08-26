'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:hz
 * @function
 * @description
 * # Hz format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('hz', function () {
        return function (hz, precision) {
            if (hz === 0 || isNaN(parseFloat(hz)) || !isFinite(hz)) {
                return '-';
            }
            if (precision === undefined) {
                precision = 1;
            }

            var units = ['Hz', 'KHz', 'MHz', 'GHz', 'THz', 'PHz'],
                number = Math.floor(Math.log(hz) / Math.log(1000)),
                val = (hz / Math.pow(1000, Math.floor(number))).toFixed(precision);

            return (/\.0*$/.test(val) ? val.substr(0, val.indexOf('.')) : val) +  ' ' + units[number];
        };
    });
