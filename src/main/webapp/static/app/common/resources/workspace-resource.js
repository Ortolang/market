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
            snapshots: {
                method: 'POST',
                url: url.api + '/workspaces/:wskey/snapshots'
            },
            checkAliasAvailability: {
                method: 'GET',
                url: url.api + '/workspaces/:alias/available'
            }
        });
    }]);
