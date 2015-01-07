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
            //getToolDesc: {
            //    url: Url.urlBaseTool() + ':pKey/:pKey/description',
            //    method: 'GET',
            //    isArray: false
            //},
            getToolDiffusion: {
                url: Url.urlBase() + '/rest/tools/:pKey',
                method: 'GET',
                isArray: false
            },
            getConfig: {
                url: Url.urlBaseTool() + ':pKey/:pKey/execution-form',
                method: 'GET',
                isArray: true
            },
            getConfigDiffusion: {
                url: Url.urlBase() + '/rest/tools/:pKey/config',
                method: 'GET',
                isArray: true
            },
            postConfig: {
                //url: Url.urlBase() + '/rest/tools/:pKey/config-new',
                url: Url.urlBaseTool() + ':pKey/:pKey/jobs',
                method: 'POST',
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            },
            postConfigDiffusion: {
                url: Url.urlBase() + '/rest/tools/:pKey/config-new',
                method: 'POST'
                //headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            },
            createToolJob: {
                method: 'POST',
                transformRequest: function (data) {
                    return $.param(data);
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                url: Url.urlBaseTool() + ':pKey/:pKey/jobs'
            },
            toolJobs: {
                method: 'GET',
                url: Url.urlBaseTool() + ':pKey/:pKey/jobs/:jId'
            },
            getToolResult: {
                method: 'GET',
                url: Url.urlBaseTool() + ':pKey/:pKey/jobs/:jId/result',
                isArray: true
            }
            //invoke: {
            //    url: Url.urlBase() + '/rest/plugins/:pKey/invoke',
            //    method: 'GET'
            //}
        });
    }]);
