'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspaceElementResource
 * @description
 * # WorkspaceElementResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('WorkspaceElementResource', ['$resource', 'Url',
        function ($resource, Url) {

            return $resource(Url.urlBase() + '/rest/workspaces/:wskey/elements/', {}, {
                put: {
                    method: 'PUT'
                }
            });
        }
    ]);
