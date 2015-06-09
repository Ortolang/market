'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceElementResource
 * @description
 * # WorkspaceElementResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceElementResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/rest/workspaces/:wskey/elements/', {}, {
            put: {
                method: 'PUT'
            }
        });
    }]);
