'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:iconFullClass
 * @function
 * @description
 * # iconFullClass
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('iconFullClass', function () {
        return function (input) {
            return input ? 'glyphicon glyphicon-' + input : '';
        };
    });
