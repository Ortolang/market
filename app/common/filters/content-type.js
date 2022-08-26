'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:contentType
 * @function
 * @description
 * # contentType
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('contentType', function () {
        return function (input) {
            return input === 'ortolang/collection' ? 'collection' : input;
        };
    });
