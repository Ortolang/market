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
                method: 'GET'
            },
            download: {
                url: url.api + '/objects/:key/download',
                method: 'GET'
            },
            element: {
                url: url.api + '/objects/:key/element',
                method: 'GET'
            },
            size: {
                url: url.api + '/objects/:key/size',
                method: 'GET'
            },
            index: {
                url: url.api + '/objects/index',
                method: 'GET',
                isArray: true
            }
        });
    }]);
