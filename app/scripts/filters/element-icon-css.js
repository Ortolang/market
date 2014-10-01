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
            switch (input) {
                case 'collection':
                    return 'glyphicon glyphicon-folder-close';
                case 'object':
                    return 'glyphicon glyphicon-file';
                case 'metadata':
                    return 'glyphicon glyphicon-list-alt';
                default:
                    return 'glyphicon glyphicon-minus';
            }
        };
    });
