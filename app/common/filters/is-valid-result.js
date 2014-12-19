'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:isValidResult
 * @function
 * @description
 * # isValidResult
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('isValidResult', function() {
        return function(input, deadline) {
            var filteredArray = [], now =  new Date();
            angular.forEach(input, function(item) {
                if (deadline && item.deadline < now)
                    filteredArray.push(item);
            });
            return filteredArray;
        };
    });
