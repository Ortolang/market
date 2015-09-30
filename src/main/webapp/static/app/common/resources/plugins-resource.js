'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.PluginsResource
 * @description
 * # PluginsResource
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('PluginsResource', ['$resource', 'url', function ($resource, url) {
        return $resource(url.api + '/tools', {}, {
                getToolPluginsList: {
                    url: url.api + '/tools',
                    method: 'GET',
                    isArray: false
                },
                getToolsList: {
                    url: url.api + '/tools/list',
                    method: 'GET',
                    isArray: false
                },
                getTool: {
                    url: url.api + '/tools/:pKey',
                    method: 'GET',
                    isArray: false
                },
                getToolDiffusion: {
                    url: url.api + '/tools/plugin/:pKey',
                    method: 'GET',
                    isArray: false
                },
                getConfigDiffusion: {
                    url: url.api + '/tools/:pKey/config',
                    method: 'GET',
                    isArray: true
                },
                postConfigDiffusion: {
                    url: url.api + '/tools/:pKey/config-new',
                    method: 'POST'
                    //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            }
        );
    }]);
