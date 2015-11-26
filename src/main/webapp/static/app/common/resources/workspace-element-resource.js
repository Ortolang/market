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

        return $resource(url.api + '/workspaces/:wskey/elements/', {}, {
            put: {
                method: 'PUT'
            },
            setPublicationPolicy: {
                method: 'PUT',
                url: url.api + '/workspaces/:wskey/elements/publication'
            },
            post: {
                method: 'POST',
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }
        });
    }]);
