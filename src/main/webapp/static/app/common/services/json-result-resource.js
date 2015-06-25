'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.JsonResultResource
 * @description
 * # JsonResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('JsonResultResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/objects/json', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
