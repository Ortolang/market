'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:split
 * @function
 * @description
 * # split
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('split', function () {
        return function (input, splitChar, splitIndex) {
            if (splitIndex < 0) {
                var index = input.split(splitChar).length + splitIndex;
                return input.split(splitChar)[index];
            }
            return input.split(splitChar)[splitIndex];
        };
    });
