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
        return $resource(url.api + '/profiles/:key', {key: '@key'}, {
            connected: {
                url: url.api + '/profiles/connected',
                method: 'GET'
            },
            search: {
                url: url.api + '/profiles/search',
                method: 'POST',
                isArray: true
            },
            update: {
                url: url.api + '/profiles/:key/infos',
                method: 'POST'
            },
            getInfos: {
                url: url.api + '/profiles/:key/infos',
                method: 'GET'
            },
            getFriends: {
                url: url.api + '/profiles/:key/friends',
                method: 'GET',
                isArray: true
            },
            read: {
                url: url.api + '/profiles/:key',
                method: 'GET'
            },
            put: {
                method: 'PUT'
            },
            size: {
                method: 'GET',
                url: url.api + '/profiles/:key/size'
            },
            ticket: {
                method: 'GET',
                url: url.api + '/profiles/:key/ticket'
            }
        });
    }]);
