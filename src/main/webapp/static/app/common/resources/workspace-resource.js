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
                url: url.api + '/workspaces/alias/:alias/available'
            },
            getWorkspaceFromAlias: {
                method: 'GET',
                url: url.api + '/workspaces/alias/:alias'
            },
            getFtpUrl: {
                method: 'GET',
                url: url.api + '/workspaces/alias/:alias/ftp'
            },
            changeOwner: {
                method: 'POST',
                url: url.api + '/workspaces/:wskey/owner',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }
        });
    }]);
