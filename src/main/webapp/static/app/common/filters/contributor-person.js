'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:contributorPerson
 * @function
 * @description
 * # Bytes format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('contributorPerson', function () {
        return function (contributors) {
            var filtered = [];
            angular.forEach(contributors, function(contributor) {
                if (contributor.entity.type === 'person') {
                    filtered.push(contributor);
                }
            });
            return filtered;
        };
    });
