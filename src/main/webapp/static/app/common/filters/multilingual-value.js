'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:multilingualValue
 * @function
 * @description
 * # Bytes format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('multilingualValue', ['Helper', function (Helper) {
        return function (multilingualValue) {
            return Helper.getMultilingualValue(multilingualValue);
        };
    }
]);
