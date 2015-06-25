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

        return $resource(url.api + '/objects/:key/', {}, {
            keys: {
                url: url.api + '/objects/:key/keys',
                method: 'GET',
                isArray: false
            },
            download: {
                url: url.api + '/objects/:key/download',
                method: 'GET',
                isArray: false
            },
            history: {
                url: url.api + '/objects/:key/history',
                method: 'GET'
            },
            element: {
                url: url.api + '/objects/:key/element',
                method: 'GET',
                isArray: false
            },
            size: {
                url: url.api + '/objects/:key/size',
                method: 'GET'
            }
        });
    }]);
