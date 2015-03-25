'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.JsonResultResource
 * @description
 * # JsonResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('JsonResultResource', ['$resource', 'Url', function ($resource, Url) {

        return $resource(Url.urlBase() + '/rest/objects/json', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
