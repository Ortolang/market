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
                method: 'GET',
                isArray: false
            },
            getTool: {
                url: Url.urlBase() + '/rest/tools/:pKey/',
                method: 'GET',
                isArray: false
            },
            getConfig: {
                url: Url.urlBase() + '/rest/tools/:pKey/config',
                method: 'GET',
                isArray: true
            },
            postConfig: {
                url: Url.urlBase() + '/rest/tools/:pKey/config-new',
                method: 'POST'
            }
            //invoke: {
            //    url: Url.urlBase() + '/rest/plugins/:pKey/invoke',
            //    method: 'GET'
            //}
        });
    }]);
