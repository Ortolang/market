'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.IndexResultResource
 * @description
 * # IndexResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('IndexResultResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/rest/objects/index', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
