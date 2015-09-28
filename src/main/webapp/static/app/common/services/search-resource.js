'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.SearchResource
 * @description
 * # SearchResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('SearchResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/search', {}, {
            json: {
                url: url.api + '/search/json',
                method: 'GET',
                isArray: true
            }
        });
    }]);
