'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['$resource', '$q', '$translate', '$rootScope', '$window', '$timeout', 'ObjectResource', 'DownloadResource', 'JsonResultResource',
        function ($resource, $q, $translate, $rootScope, $window, $timeout, ObjectResource, DownloadResource, JsonResultResource) {

            // ---
            // ORTOLANG TOOL DEFINITION
            // ---

            // Constructor
            function OrtolangTool(config) {
                this.id = undefined;
                this.key = undefined;
                this.name = undefined;
                this.description = undefined;
                this.documentation = undefined;
                this.meta = undefined;
                this.url = undefined;
                this.config = undefined;
                this.active = undefined;

                angular.forEach(config, function (value, key) {
                    if (this.hasOwnProperty(key)) {
                        this[key] = value;
                    }
                }, this);

                this.resource = $resource(this.url, {}, {
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
                    abort: {
                        url: this.url + '/jobs/:jobId/abort',
                        method: 'GET'
                    },
                    getAuthStatus: {
                        url: this.url + '/client/grant',
                        method: 'GET'
                    },
                    getLog: {
                        url: this.url + '/jobs/:jobId/log',
                        method: 'GET'
                    },
                    getResult: {
                        url: this.url + '/jobs/:jobId/result',
                        method: 'GET',
                        isArray: true
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

                getDocumentation: function () {
                    return this.documentation;
                },

                getMeta: function () {
                    return this.meta;
                },

                getUrl: function () {
                    return this.url;
                },

                getResource: function () {
                    return this.resource;
                },

                getExecutionForm: function () {
                    if (!this.getActive()) {
                        throw ('The tool "%s" is not active', this.getKey());
                    } else if (this.config) {
                        return this.config;
                    }
                    return this.resource.getExecutionForm({language: $translate.use()});
                },

                getActive: function () {
                    return this.active;
                },

                getJobs: function () {
                    return this.resource.getJobs();
                },

                createJob: function (formData) {
                    return this.resource.createJob({}, formData);
                },

                abortJob: function (jobId) {
                    return this.resource.abort({jobId:jobId});
                },

                getAuthStatus: function () {
                    var deferred = $q.defer();
                    this.resource.getAuthStatus().$promise.then(function (url) {
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
                },

                getResult: function (jobId) {
                    return this.resource.getResult({jobId:jobId});
                },

                getDownloadUrl: function (jobId, path) {
                    return this.url + '/jobs/' + jobId + '/download?path=' + path;
                }
            };

            // ---
            // MANAGER.
            // ---

            var registry = {},
                grantPopup,
                grantTimeout,
                grantTimeoutDelay = 500;

            function getRegistry() {
                return registry;
            }

            function getActiveRegistry() {
                var activeRegistry = [];
                angular.forEach(registry, function (tool) {
                    if(tool.active) {
                        activeRegistry.push(tool);
                    }
                });
                return activeRegistry;
            }

            function register(tool) {
                if (registry[tool.getKey()]) {
                    console.error('A tool with the id "%s" has already been registered', tool.getKey());
                    return;
                }
                registry[tool.getKey()] = tool;
                console.info('register tool : ', (registry[tool.getKey()]));
            }

            function populateToolList() {

                var queryStr = 'select key, meta.title as title, meta.description as description, meta.toolId as toolId, meta.toolHelp as toolHelp, meta.toolUrl as toolUrl from collection where status = \'published\' and meta.type = \'Outil\' ';
                console.log(queryStr);
                JsonResultResource.get({query: queryStr}).$promise.then(function (jsonResults) {
                        
                        angular.forEach(angular.fromJson(jsonResults), function (itemMeta) {
                            var item = {};
                            
                            var data = angular.fromJson(itemMeta);
                            item.key = data.key;
                            item.id = data.toolId;
                            item.name = data.title;
                            item.description = data.description;
                            item.documentation = data.toolHelp;
                            item.url = data.toolUrl;
                            item.meta = data;
                            item.active = true;

                            register(new OrtolangTool(item));
                            console.log('register '+item.name);
                        });
                        console.log('fin populate tool list');
                        $rootScope.$broadcast('tool-list-registered');

                }, function (reason) {
                    console.error('An issue occurred when trying to get the tool list: %o', reason);
                });
            }

            function disableTool(toolKey) {
                if (registry[toolKey]) {
                    registry[toolKey].active = false;
                    console.warn('The tool "%s" has been disabled', toolKey);
                    return;
                }
                console.error('There is no tool with the id "%s" in registry', toolKey);
            }

            function getTool(toolKey) {
                return registry[toolKey];
            }


            function checkPopup(toolKey) {
                if (grantPopup.closed) {
                    $timeout.cancel(grantTimeout);
                    checkGrant(toolKey);
                } else {
                    grantTimeout = $timeout(checkPopup, 500);
                }
            }

            function checkGrant(toolKey) {
                getTool(toolKey).getAuthStatus().then(function (response) {
                    if (response.url) {
                        grantPopup = $window.open(response.url, '', 'width=400, height=600, top=200, left=200');
                        grantTimeout = $timeout(checkPopup(toolKey), grantTimeoutDelay);
                    } else {
                        console.log('Grant OK!');
                    }
                });
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
                getActiveRegistry: getActiveRegistry,
                getTool: getTool,
                disableTool: disableTool,
                checkGrant: checkGrant
            };
        }]);
