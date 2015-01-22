'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['$resource', '$q', '$translate', '$rootScope', 'ObjectResource', 'DownloadResource', 'N3Serializer', '$filter',
        function ($resource, $q, $translate, $rootScope, ObjectResource, DownloadResource, N3Serializer, $filter) {

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
                abort: {
                    url: this.url + '/jobs/:jobId/abort',
                    method: 'GET'
                },
                hasToken: {
                    url: this.url + '/token',
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

            getDefinition: function () {
                return this.resource.getDefinition({language:$translate.use()});
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

        var registry = {};

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
            console.debug('register tool : ', (registry[tool.getKey()]));
            $rootScope.$broadcast('tool-list-registered');
        }

        function populateToolList() {
            var deferred = $q.defer();
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(
                function (oobjects) {
                    var index = 0;
                    var items = [];
                    angular.forEach(oobjects.entries, function (entry) {
                        items.push({key: entry, rang: index});
                        index++;
                    });

                    loadMetadata(items);
                },
                function (error) {
                    console.error('An issue occurred when trying to get the tool list: %o', error);
                    deferred.reject();
                }
            );
            return deferred.promise;
        }

        function loadMetadata(items) {
            angular.forEach(items, function (item) {
                // Loads properties of each object
                ObjectResource.get({oKey: item.key}).$promise
                        .then(function (oobject) {
                            if (oobject.object.root === true) {
                                if (oobject.object.metadatas.length > 0) {

                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {

                                            if ( data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type']==='Outil') {
                                                item.id = data['http://www.ortolang.fr/ontology/toolId'];
                                                item.name = data['http://purl.org/dc/elements/1.1/title'];
                                                item.description = data['http://purl.org/dc/elements/1.1/description'];
                                                item.documentation = data['http://www.ortolang.fr/ontology/toolHelp'];
                                                item.url = data['http://www.ortolang.fr/ontology/toolUrl'];
                                                item.meta = data;
                                                item.active = true;

                                                register(new OrtolangTool(item));
                                            }
                                        });
                                    }).error(function (error) {
                                        console.error('An issue occurred when trying to get the tool list: %o', error);
                                    });
                                }
                            }
                        }, function (reason) {
                            console.error('An issue occurred when trying to get the tool list: %o', reason);
                        }
                    );
            });
        }

        function getTool(toolKey) {
            return registry[toolKey];
        }

        function desactivateTool(toolKey) {
            if (registry[toolKey]) {
                registry[toolKey].active = false;
                console.log('The tool "%s" has been desactivated', toolKey);
            }
            console.error('There is no tool with the id "%s" in registry', toolKey);
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
            desactivateTool: desactivateTool
        };
    }]);