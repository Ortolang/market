'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.GroupResource
 * @description
 * # GroupResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('GroupResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/groups/:key', {}, {
            createGroup: {
                method: 'POST'
            },
            updateGroup: {
                method: 'PUT'
            },
            deleteGroup: {
                method: 'DELETE'
            },
            addMember: {
                method: 'PUT',
                url: url.api + '/groups/:key/members/:member'
            },
            removeMember: {
                method: 'DELETE',
                url: url.api + '/groups/:key/members/:member'
            }
        });
    }]);
