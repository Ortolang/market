'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PluginsResource
 * @description
 * # PluginsResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('PluginsResource', ['$resource', 'Url', function ($resource, Url) {
        return $resource(Url.urlBase() + '/rest/plugins', {}, {
            getPluginsList: {
                method: 'GET',
                isArray: false
            },
            getPlugin: {
                url: Url.urlBase() + '/rest/plugins/:pKey/',
                method: 'GET',
                isArray: false
            },
            getConfig: {
                url: Url.urlBase() + '/rest/plugins/:pKey/config',
                method: 'GET',
                isArray: true
            },
            postConfig: {
                url: Url.urlBase() + '/rest/plugins/:pKey/config-new',
                method: 'POST'
            },
            invoke: {
                url: Url.urlBase() + '/rest/plugins/:pKey/invoke',
                method: 'GET'
            }
        });
    }]);
