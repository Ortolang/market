'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceResource
 * @description
 * # WorkspaceResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/workspaces/:wskey', {}, {
            createWorkspace: {
                method: 'POST'
            },
            updateWorkspace: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                isArray: false
            },
            snapshots: {
                method: 'POST',
                url: url.api + '/workspaces/:wskey/snapshots',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            },
            getKey: {
                method: 'GET',
                url: url.api + '/workspaces/:alias/key'
            },
            getAvailability: {
                method: 'GET',
                url: url.api + '/workspaces/:alias/available'
            }
        });
    }]);
