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
            put: {
                method: 'PUT'
            }
        });
    }]);
