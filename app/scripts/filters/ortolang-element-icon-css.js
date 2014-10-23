'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:ortolangElementIconCss
 * @function
 * @description
 * # ortolangElementIconCss
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('ortolangElementIconCss', ['icons', function (icons) {
        return function (input) {
            return icons.ortolang[input] || icons.ortolang.unknown;
        };
    }]);
