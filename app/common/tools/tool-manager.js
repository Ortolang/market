'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['$resource', '$q', '$translate', '$rootScope', '$window', '$timeout', 'Content', 'SearchResource',
        function ($resource, $q, $translate, $rootScope, $window, $timeout, Content, SearchResource) {

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
                this.model = undefined;
                this.active = undefined;
                this.inputData = undefined;
                this.outputData = undefined;
                this.functionalities = undefined;
                this.image = undefined;

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
                    getDefaultForm: {
                        url: this.url + '/default-form',
                        method: 'GET'
                    },
                    getJobs: {
                        url: this.url + '/jobs',
                        method: 'GET'
                    },
                    getJob: {
                        url: this.url + '/jobs/:jobid',
                        method: 'GET'
                    },
                    createJob: {
                        url: this.url + '/jobs',
                        method: 'POST',
                        transformRequest: function (data) { return $.param(data); },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
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
                    },
                    save: {
                        url: this.url + '/jobs/:jobId/save',
                        method: 'POST',
                        transformRequest: function (data) { return $.param(data); },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

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

                getInputData: function () {
                    return this.inputData;
                },

                getOutputData: function () {
                    return this.outputData;
                },

                getImage: function () {
                    return this.image;
                },

                getFunctionalities: function () {
                    return this.categories;
                },

                getResource: function () {
                    return this.resource;
                },

                getExecutionForm: function () {
                    if (!this.getActive()) {
                        throw ('The tool "' + this.getKey() + '" is not active');
                    }
                    if (this.config) {
                        return this.config;
                    }
                    return this.resource.getExecutionForm({language: $translate.use()});
                },

                getModelForm: function () {
                    if (!this.getActive()) {
                        throw ('The tool "' + this.getKey() + '" is not active');
                    }
                    if (this.model) {
                        return this.model;
                    }
                    return this.resource.getDefaultForm({});
                },

                getForm: function () {
                    return $q.all([this.getModelForm(), this.getExecutionForm()]);
                },

                getActive: function () {
                    return this.active;
                },

                getJobs: function () {
                    return this.resource.getJobs();
                },

                getJob: function (jobid) {
                    return this.resource.getJob({jobid: jobid});
                },

                createJob: function (formData) {
                    return this.resource.createJob({}, angular.fromJson(angular.toJson(formData)));
                },

                abortJob: function (jobId) {
                    return this.resource.abort({jobId: jobId});
                },

                getAuthStatus: function () {
                    var deferred = $q.defer();
                    this.resource.getAuthStatus().$promise.then(function (url) {
                        if (url) {
                            deferred.resolve(url);
                        } else {
                            deferred.resolve(true);
                        }
                    });
                    return deferred.promise;
                },

                getLog: function (jobId) {
                    return this.resource.getLog({jobId: jobId});
                },

                getResult: function (jobId) {
                    return this.resource.getResult({jobId: jobId});
                },

                getDownloadUrl: function (jobId, path) {
                    return this.url + '/jobs/' + jobId + '/download?path=' + path;
                },
                saveResult: function (jobId, formData) {
                    return this.resource.save({jobId: jobId}, angular.fromJson(angular.toJson(formData)));
                }
            };

            // ---
            // MANAGER.
            // ---

            var registry = {},
                functionalitiesList = [],
                inputDatasList = [],
                outputDatasList = [],
                loaded = false,
                grantPopup,
                grantTimeout,
                grantTimeoutDelay = 500,
                initialized = false;

            function getRegistry() {
                return registry;
            }

            function getActiveTools() {
                var activeTools = [];
                angular.forEach(registry, function (tool) {
                    if (tool.active) {
                        activeTools.push(tool);
                    }
                });
                return activeTools;
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
                //
                //var queryBuilder = QueryBuilderFactory.make({
                //    projection: 'key',
                //    source: 'collection'
                //});
                //queryBuilder.addProjection('meta_ortolang-item-json.title', 'title');
                //queryBuilder.addProjection('meta_ortolang-item-json.description', 'description');
                //queryBuilder.addProjection('meta_ortolang-item-json.image', 'image');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolId', 'id');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolHelp', 'help');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolUrl', 'url');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolInputData', 'inputData');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolOutputData', 'outputData');
                //queryBuilder.addProjection('meta_ortolang-item-json.toolFunctionalities', 'functionalities');
                //queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
                //queryBuilder.equals('status', 'published');
                //queryBuilder.and();
                //queryBuilder.equals('meta_ortolang-item-json.type', 'Outil');
                //
                //var query = queryBuilder.toString();

                
                // SearchResource.findCollections({type: 'Outil'}, function (jsonResults) {
                //     angular.forEach(jsonResults, function (itemMeta) {
                //         var item = {},
                //             data = angular.fromJson(itemMeta);
                //         item.key = data.key;
                //         item.id = data.id;
                //         item.name = data.title;
                //         item.description = data.description;
                //         item.documentation = data.help;
                //         item.url = data.url;
                //         if (data.inputData) {
                //             item.inputData = data.inputData.filter(function (elem, pos) {
                //                 return data.inputData.indexOf(elem) === pos;
                //             });
                //             angular.forEach(item.inputData, function (input) {
                //                 inputDatasList.push(input);
                //             });
                //         }
                //         if (data.outputData) {
                //             item.outputData = data.outputData.filter(function (elem, pos) {
                //                 return data.outputData.indexOf(elem) === pos;
                //             });
                //             angular.forEach(item.outputData, function (output) {
                //                 outputDatasList.push(output);
                //             });
                //         }
                //         if (data.functionalities) {
                //             item.functionalities = data.functionalities.filter(function (elem, pos) {
                //                 return data.functionalities.indexOf(elem) === pos;
                //             });
                //             angular.forEach(item.functionalities, function (fnc) {
                //                 functionalitiesList.push(fnc);
                //             });
                //         }
                //         item.meta = data;
                //         if (item.url !== undefined && item.url !== '') {
                //             item.active = true;
                //         }

                //         if (data.image !== undefined && data.image !== '') {
                //             item.image = Content.getContentUrlWithPath(data.image, data.alias, 'latest');
                //             register(new OrtolangTool(item));
                //         } else {
                //             register(new OrtolangTool(item));
                //         }
                //         console.log('register ' + item.name);
                //     });
                //     loaded = true;
                //     $rootScope.$broadcast('tool-list-registered');

                // }, function (reason) {
                //     console.error('An issue occurred when trying to get the tool list: %o', reason);
                // });
            }

            function isRegistryLoaded() {
                return loaded;
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

            function getKeys() {
                return Object.keys(registry);
            }

            function toArray(obj) {
                var output = [];
                angular.forEach(obj, function (value, key) {
                    output.push(getTool(key));
                });
                return output;
            }

            function checkPopup(toolKey, deferred) {
                if (grantPopup.closed) {
                    $timeout.cancel(grantTimeout);
                    checkGrant(toolKey, deferred);
                } else {
                    grantTimeout = $timeout(function () {
                        checkPopup(toolKey, deferred);
                    }, grantTimeoutDelay);
                }
            }

            function checkGrant(toolKey, previousDeferred) {
                var deferred = $q.defer();
                getTool(toolKey).getAuthStatus().then(function (response) {
                    if (response.url) {
                        if (previousDeferred) {
                            // Grant cancelled
                            previousDeferred.reject();
                        } else {
                            grantPopup = $window.open(response.url, '', 'width=400, height=600, top=200, left=200');
                            grantTimeout = $timeout(function () {
                                checkPopup(toolKey, deferred);
                            }, grantTimeoutDelay);
                        }
                    } else {
                        // Grant OK
                        if (previousDeferred) {
                            previousDeferred.resolve(true);
                        } else {
                            deferred.resolve(true);
                        }
                    }
                });
                if (previousDeferred === undefined) {
                    return deferred.promise;
                }
            }

            function getFunctionalities() {
                return functionalitiesList;
            }

            function getInputDatas() {
                return inputDatasList;
            }

            function getOutputDatas() {
                return outputDatasList;
            }


            // *********************** //
            //           Init          //
            // *********************** //

            $rootScope.$on('core.workspace.create', function () {
                populateToolList();
            });

            function init() {
                if (!initialized) {
                    initialized = true;
                    populateToolList();
                }
            }

            return {
                getRegistry: getRegistry,
                isRegistryLoaded : isRegistryLoaded,
                getActiveTools: getActiveTools,
                getTool: getTool,
                disableTool: disableTool,
                checkGrant: checkGrant,
                getKeys: getKeys,
                toArray: toArray,
                getFunctionalities: getFunctionalities,
                getInputData: getInputDatas,
                getOutputData: getOutputDatas,
                init: init
            };
        }]);
