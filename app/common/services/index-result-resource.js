'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.IndexResultResource
 * @description
 * # IndexResultResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('IndexResultResource', ['$resource', 'Url', function ($resource, Url) {

        return $resource(Url.urlBase() + '/rest/objects/index', {}, {
            get: {
                method: 'GET',
                isArray: true
            }
        });
    }]);
