'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.WorkspacesDAO
 * @description
 * # WorkspacesDAO
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
      .factory('WorkspacesDAO', ['$resource', 'Url',
        function ($resource, Url) {

            return $resource(Url.urlBase() + '/rest/workspaces/:wsName', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
            });
        }
    ]);
