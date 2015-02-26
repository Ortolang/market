'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['$resource', '$q', '$translate', '$rootScope', '$window', '$timeout', 'ObjectResource', 'DownloadResource', 'N3Serializer',
        function ($resource, $q, $translate, $rootScope, $window, $timeout, ObjectResource, DownloadResource, N3Serializer) {

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

            function getActiveTools() {
                var activeTools = [];
                angular.forEach(registry, function (tool) {
                    if(tool.active) {
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
                //console.info('register tool : ', (registry[tool.getKey()]));
            }

            function populateToolList() {
                var deferred = $q.defer();
                ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(
                    function (oobjects) {
                        loadMetadata(oobjects.entries, deferred);
                    },
                    function (error) {
                        console.error('An issue occurred when trying to get the tool list: %o', error);
                        deferred.reject();
                    }
                );
                return deferred.promise;
            }

            function loadMetadata(itemKeys, deferred) {
                var promises = [];
                angular.forEach(itemKeys, function (itemKey) {
                    var item = {key: itemKey},
                        itemDeferred = $q.defer();
                    promises.push(itemDeferred.promise);
                    // Loads properties of each object
                    ObjectResource.get({oKey: itemKey}).$promise.then(function (oobject) {
                        if (oobject.object.root === true && oobject.object.metadatas.length > 0) {
                            var metaKey = oobject.object.metadatas[0].key;
                            DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                N3Serializer.fromN3(metaContent).then(function (data) {
                                    if (data['http://www.ortolang.fr/ontology/type'] &&
                                        data['http://www.ortolang.fr/ontology/type'] === 'Outil') {

                                        item.id = data['http://www.ortolang.fr/ontology/toolId'];
                                        item.name = data['http://purl.org/dc/elements/1.1/title'];
                                        item.description = data['http://purl.org/dc/elements/1.1/description'];
                                        item.documentation = data['http://www.ortolang.fr/ontology/toolHelp'];
                                        item.url = data['http://www.ortolang.fr/ontology/toolUrl'];
                                        item.meta = data;
                                        item.active = true;

                                        register(new OrtolangTool(item));
                                        itemDeferred.resolve();
                                    } else {
                                        itemDeferred.resolve();
                                    }
                                });
                            }).error(function (error) {
                                itemDeferred.reject();
                                console.error('An issue occurred when trying to get the tool list: %o', error);
                            });
                        } else {
                            itemDeferred.resolve();
                        }
                    });
                });
                $q.all(promises).then(
                    function success() {
                        $rootScope.$broadcast('tool-list-registered');
                        deferred.resolve();
                    },
                    function error() {
                        deferred.reject();
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


            function checkPopup(toolKey, deferred) {
                if (grantPopup.closed) {
                    $timeout.cancel(grantTimeout);
                    checkGrant(toolKey, deferred);
                } else {
                    grantTimeout = $timeout(function () {checkPopup(toolKey, deferred);}, grantTimeoutDelay);
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
                            grantTimeout = $timeout(function () {checkPopup(toolKey, deferred);}, grantTimeoutDelay);
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

            // *********************** //
            //           Init          //
            // *********************** //

            function init() {
                populateToolList();
            }

            init();

            return {
                getRegistry: getRegistry,
                getActiveTools: getActiveTools,
                getTool: getTool,
                disableTool: disableTool,
                checkGrant: checkGrant
            };
        }]);
