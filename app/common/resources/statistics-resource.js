'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.StatisticsResource
 * @description
 * # StatisticsResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('StatisticsResource', ['$resource', 'url', function ($resource, url) {

        return $resource(url.api + '/stats/:names', {}, {
            getWorkspaceStats: {
                method: 'GET',
                url: url.api + '/stats/workspaces/:alias',
                isArray: true
            }
        });
    }]);
