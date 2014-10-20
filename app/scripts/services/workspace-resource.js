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

        return $resource(Url.urlBase() + '/rest/workspaces/:wsName', {}, {
            query: {
                method: 'GET',
                isArray: false
            },
            download: {
                url: Url.urlBase() + '/rest/workspaces/:wsName/download',
                method: 'GET',
                isArray: false
            }
        });
    }]);
