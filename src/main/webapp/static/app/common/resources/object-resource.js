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
            element: {
                url: url.api + '/objects/:key/element',
                method: 'GET'
            },
            history: {
                url: url.api + '/objects/:key/history',
                method: 'GET',
                isArray: true
            },
            size: {
                url: url.api + '/objects/:key/size',
                method: 'GET'
            },
            index: {
                url: url.api + '/objects/index',
                method: 'GET',
                isArray: true
            },
            isAuthorized: {
                url: url.api + '/objects/:key/authorized',
                method: 'GET'
            }
        });
    }]);
