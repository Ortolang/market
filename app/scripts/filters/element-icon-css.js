'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:elementIconCss
 * @function
 * @description
 * # elementIconCss
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('elementIconCss', function () {
        return function (input) {
            return input === 'collection' ? 'glyphicon glyphicon-folder-close' : 'glyphicon glyphicon-file';
        };
    });
