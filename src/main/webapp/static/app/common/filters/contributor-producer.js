'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:contributorProducer
 * @function
 * @description
 * # Bytes format filter
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('contributorProducer', function () {
        return function (contributors) {
            var filtered = [];
            angular.forEach(contributors, function(contributor) {
                var iRole;
                for (iRole = 0; iRole < contributor.role.length; iRole++) {
                    if (contributor.role[iRole] === 'producer') {
                        filtered.push(contributor);
                    }
                }
            });
            return filtered;
        };
    });
