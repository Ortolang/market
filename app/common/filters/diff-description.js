'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:diffDescription
 * @function
 * @description
 * # diffDescription
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('diffDescription', ['icons', function (icons) {

        return function (change) {
            if (change.type === 'ValueChange') {
                if (change.change.propertyName === 'path') {
                    return change.change.left;
                }
                return icons.diff.binary;
            }
            if (change.type === 'MapChange') {
                if (change.change.propertyName === 'metadatas') {
                    var changes = '';
                    angular.forEach(change.change.entryChanges, function (entryChange) {
                        if (changes.length > 0) {
                            changes += ', ';
                        }
                        if (entryChange.value) {
                            changes += '+ ';
                        } else {
                            changes += '• ';
                        }
                        changes += entryChange.key;
                    });
                    return changes;
                }
            }
        };
    }]);
