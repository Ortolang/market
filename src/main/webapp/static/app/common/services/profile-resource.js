'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ProfileResource
 * @description
 * # ProfileResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ProfileResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/profiles/:key', {key: '@key'}, {
            connected: {
                url: Url.urlBase() + '/rest/profiles/connected',
                method: 'GET'
            },
            search: {
                url: Url.urlBase() + '/rest/profiles/search',
                method: 'POST',
                isArray: true
            },
            update: {
                url: Url.urlBase() + '/rest/profiles/:key/infos',
                method: 'POST'
            },
            getInfos: {
                url: Url.urlBase() + '/rest/profiles/:key/infos',
                method: 'GET'
            },
            getFriends: {
                url: Url.urlBase() + '/rest/profiles/:key/friends',
                method: 'GET',
                isArray: true
            },
            read: {
                url: Url.urlBase() + '/rest/profiles/:key',
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
            size: {
                method: 'GET',
                url: Url.urlBase() + '/rest/profiles/:key/size'
            }
        });
    }]);
