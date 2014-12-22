'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceResource
 * @description
 * # WorkspaceResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceResource', ['$resource', 'Url', function ($resource, Url) {

        return $resource(Url.urlBase() + '/rest/workspaces/:wskey', {}, {
            query: {
                method: 'GET',
                isArray: false
            },
            snapshots: {
                method: 'POST',
                url: Url.urlBase() + '/rest/workspaces/:wskey/snapshots',
                transformRequest: function (data) { return $.param(data); },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }
        });
    }]);
