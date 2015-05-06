'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ObjectResource
 * @description
 * # ObjectResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ObjectResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/rest/objects/:oKey/', {}, {
            keys: {
                url: url.api + '/rest/objects/:oKey/keys',
                method: 'GET',
                isArray: false
            },
            download: {
                url: url.api + '/rest/objects/:oKey/download',
                method: 'GET',
                isArray: false
            },
            history: {
                url: url.api + '/rest/objects/:oKey/history',
                method: 'GET'
            },
            element: {
                url: url.api + '/rest/objects/:oKey/element',
                method: 'GET',
                isArray: false
            },
            size: {
                url: url.api + '/rest/objects/:oKey/size',
                method: 'GET'
            }
        });
    }]);
