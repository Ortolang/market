'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['$resource', '$q', 'ToolsResource', '$translate', function ($resource, $q, ToolsResource, $translate) {

        // ---
        // ORTOLANG TOOL DEFINITION
        // ---

        // Constructor
        function OrtolangTool(config) {
            this.id = undefined;
            this.key = undefined;
            this.name = undefined;
            this.description = undefined;
            this.url = undefined;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);

            this.resource = $resource(this.url, {}, {
                getDefinition: {
                    url: this.url + '/definition',
                    method: 'GET'
                },
                getExecutionForm: {
                    url: this.url + '/execution-form',
                    method: 'GET',
                    isArray: true
                },
                getJobs: {
                    url: this.url + '/jobs',
                    method: 'GET'
                },
                createJob: {
                    url: this.url + '/jobs',
                    method: 'POST',
                    transformRequest: function (data) {
                        return $.param(data);
                    },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                },
                hasToken: {
                    url: this.url + '/token',
                    method: 'GET'
                },
                getLog: {
                    url: this.url + '/jobs/:jobId/log',
                    method: 'GET'
                }
            });
        }

        // Methods
        OrtolangTool.prototype = {

            getId: function () {
                return this.id;
            },

            getKey: function () {
                return this.key;
            },

            getName: function () {
                return this.name || this.id;
            },

            getDescription: function () {
                return this.description;
            },

            getUrl: function () {
                return this.url;
            },

            getResource: function () {
                return this.resource;
            },

            getDefinition: function () {
                return this.resource.getDefinition({language:$translate.use()});
            },

            getExecutionForm: function () {
                return this.resource.getExecutionForm({language:$translate.use()});
            },

            getJobs: function () {
                return this.resource.getJobs();
            },

            createJob: function (formData) {
                return this.resource.createJob({}, formData);
            },

            hasToken: function () {
                var deferred = $q.defer();
                this.resource.hasToken().$promise.then(function (url) {
                    if (url) {
                        console.log(url);
                        deferred.resolve(url);
                    } else {
                        deferred.resolve(true);
                    }
                });
                return deferred.promise;
            },

            getLog: function (jobId) {
                return this.resource.getLog({jobId:jobId});
            }
        };

        // ---
        // MANAGER.
        // ---

        var registry = {};

        function getRegistry() {
            return registry;
        }

        function register(tool) {
            if (registry[tool.getKey()]) {
                console.error('A tool with the id "%s" has already been registered', tool.getKey());
                return;
            }
            console.log(tool);
            registry[tool.getKey()] = tool;
        }

        function populateToolList() {
            ToolsResource.getToolsList(
                function (tools) {
                    angular.forEach(tools.entries, function (tool) {
                        register(new OrtolangTool(tool));
                    });
                },
                function (error) {
                    console.error('An issue occurred when trying to get the tool list: %o', error);
                }
            );
        }

        function getTool(toolKey) {
            return registry[toolKey];
        }


        // *********************** //
        //           Init          //
        // *********************** //

        function init() {
            populateToolList();
        }

        init();

        return {
            getRegistry: getRegistry,
            getTool: getTool
        };
    }]);
