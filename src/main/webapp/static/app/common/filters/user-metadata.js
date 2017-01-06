'use strict';

/**
 * @ngdoc filter
 * @name ortolangMarketApp.filter:split
 * @function
 * @description
 * # split
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('userMetadata', ['$filter', function ($filter) {
        return function (metadatas) {
            return $filter('filter')(metadatas, function (metadata) {
                return metadata.name.indexOf('ortolang-') !== 0 && metadata.name.indexOf('system-') !== 0;
            });
        };
    }]);
