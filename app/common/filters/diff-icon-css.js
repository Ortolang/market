'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:diffIconCss
 * @function
 * @description
 * # diffIconCss
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('diffIconCss', ['icons', function (icons) {

        return function (change) {
            if (change.type === 'NewObject') {
                return icons.diff.new;
            }
            if (change.type === 'ObjectRemoved') {
                return icons.diff.removed;
            }
            if (change.type === 'ValueChange') {
                if (change.change.propertyName === 'path') {
                    return icons.diff.renamed;
                }
                return icons.diff.binary;
            }
            if (change.type === 'MapChange') {
                if (change.change.propertyName === 'metadatas') {
                    return icons.diff.metadatas;
                }
            }
        };
    }]);
