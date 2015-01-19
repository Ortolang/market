'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PluginsResource
 * @description
 * # PluginsResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolsResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/tools', {}, {
            getToolsList: {
                url: Url.urlBase() + '/rest/tools/list',
                method: 'GET',
                isArray: false
            }
        });
    }]);
