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
            },
            download: {
                url: Url.urlBase() + '/rest/objects/:oKey/download',
                method: 'GET',
                isArray: false
            },
            downloadTicket: {
                url: Url.urlBase() + '/rest/objects/:oKey/download/ticket',
                method: 'GET'
            },
            history: {
                url: Url.urlBase() + '/rest/objects/:oKey/history',
                method: 'GET'
            },
            element: {
                url: Url.urlBase() + '/rest/objects/:oKey/element',
                method: 'GET',
                isArray: false
            }
        });
    }]);
