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
        return $resource(Url.urlBase() + '/rest/profiles/:userId', {userId: '@key'}, {
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
                url: Url.urlBase() + '/rest/profiles/:userId/infos',
                method: 'POST'
            },
            getInfos: {
                url: Url.urlBase() + '/rest/profiles/:userId/infos',
                method: 'GET'
            },
            getFriends: {
                url: Url.urlBase() + '/rest/profiles/:userId/friends',
                method: 'GET',
                isArray: true
            },
            read: {
                url: Url.urlBase() + '/rest/profiles/:userId',
                method: 'GET'
            },
            put: {
                method: 'PUT'
            }
        });
    }]);
