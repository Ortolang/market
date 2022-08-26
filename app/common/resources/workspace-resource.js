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

        //noinspection JSUnusedGlobalSymbols
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
            },
            notifyOwner: {
                method: 'POST',
                url: url.api + '/workspaces/:wskey/owner/message',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            },
            addMember: {
                method: 'PUT',
                url: url.api + '/workspaces/:wskey/members/:member'
            },
            addPrivilegedMember: {
                method: 'PUT',
                url: url.api + '/workspaces/:wskey/privileged/:member'
            },
            listEvents: {
                method: 'GET',
                url: url.api + '/workspaces/:wskey/events'
            },
            diffWorkspaceContent: {
                method: 'GET',
                url: url.api + '/workspaces/:wskey/diff',
                isArray: true
            },
            listSnapshotContent: {
                method: 'GET',
                url: url.api + '/workspaces/:wskey/snapshots/:sid/content'
            }
        });
    }]);
