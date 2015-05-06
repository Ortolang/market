'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ProfileResource
 * @description
 * # ProfileResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ProfileResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/rest/profiles/:key', {key: '@key'}, {
            connected: {
                url: url.api + '/rest/profiles/connected',
                method: 'GET'
            },
            search: {
                url: url.api + '/rest/profiles/search',
                method: 'POST',
                isArray: true
            },
            update: {
                url: url.api + '/rest/profiles/:key/infos',
                method: 'POST'
            },
            getInfos: {
                url: url.api + '/rest/profiles/:key/infos',
                method: 'GET'
            },
            getFriends: {
                url: url.api + '/rest/profiles/:key/friends',
                method: 'GET',
                isArray: true
            },
            read: {
                url: url.api + '/rest/profiles/:key',
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
            size: {
                method: 'GET',
                url: url.api + '/rest/profiles/:key/size'
            },
            ticket: {
                method: 'GET',
                url: url.api + '/rest/profiles/:key/ticket'
            }
        });
    }]);
