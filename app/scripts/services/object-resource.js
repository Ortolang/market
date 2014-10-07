'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ObjectResource
 * @description
 * # ObjectResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ObjectResource', ['$resource', 'Url', function ($resource, Url) {

        return $resource(Url.urlBase() + '/rest/objects/:oKey/', {}, {
            keys: {
                url: Url.urlBase() + '/rest/objects/:oKey/keys',
                method: 'GET',
                isArray: false
            }
        });
    }]);
