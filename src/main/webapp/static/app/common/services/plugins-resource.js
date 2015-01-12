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
        return $resource(Url.urlBase() + '/rest/tools', {}, {
                getToolPluginsList: {
                    url: Url.urlBase() + '/rest/tools',
                    method: 'GET',
                    isArray: false
                },
                getToolsList: {
                    url: Url.urlBase() + '/rest/tools/list',
                    method: 'GET',
                    isArray: false
                },
                getTool: {
                    url: Url.urlBase() + '/rest/tools/:pKey',
                    method: 'GET',
                    isArray: false
                },
                getToolDiffusion: {
                    url: Url.urlBase() + '/rest/tools/plugin/:pKey',
                    method: 'GET',
                    isArray: false
                },
                getConfigDiffusion: {
                    url: Url.urlBase() + '/rest/tools/:pKey/config',
                    method: 'GET',
                    isArray: true
                },
                postConfigDiffusion: {
                    url: Url.urlBase() + '/rest/tools/:pKey/config-new',
                    method: 'POST'
                    //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            }
        );
    }]);
