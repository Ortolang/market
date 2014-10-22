'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PluginctrlCtrl
 * @description
 * # PluginctrlCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PluginCtrl', [ '$scope', '$http', 'PluginsResource', '$routeParams', 'formlyTemplate', 'AuthService', '$filter', 'WorkspaceElementResource', '$q', 'Url',
        function ($scope, $http, PluginsResource, $routeParams, formlyTemplate, AuthService, $filter, WorkspaceElementResource, $q, Url) {
            /**
             * Load chosen plugin informations
             */
            $scope.loadPlugin = function () {
                $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
                PluginsResource.getPlugin({pKey: $routeParams.plName},
                    function (plugin) {
                        $scope.plugin = plugin;
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            /**
             * Load config JSON form for the plugin
             * @return {*[]}
             */
            $scope.loadConfig = function () {
                $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
                PluginsResource.getConfig({pKey: $routeParams.plName},
                    function (config) {
                        $scope.initialiseFormConfig(config);
                        console.debug(config);
                        $scope.generateForm(config);
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            /**
             * Push object from workspace in an array
             * @param workspaces
             * @param callback
             */
            $scope.pushDataObjects = function (workspaces, callback) {
                var deferred = $q.defer(), promise = [], list = [];
                workspaces.forEach(function (index) {
                    promise.push(WorkspaceElementResource.get({wsName: index.key, path: '/', root: 'head'}).$promise
                        .then(function (element) {
                            var tmp = $filter('filter')(element.elements, {'type': 'object'});
                            list = list.concat(tmp);
                        }));
                });

                $q.all(promise).then(function () {
                    $scope.listAvailableDataObject = list;
                    callback();
                });
                deferred.resolve();
            };

            /**
             * Initialise the form from the JSON config
             * @param configJSON
             */
            $scope.initialiseFormConfig = function (configJSON) {
                // parcours du json pour initialiser le formulaire : les éventuels dataobject sont séléctionnés dans le workspace avec un typeahead
                var objectsFieldList = $filter('filter')(configJSON, {'type': 'dataobject'});
                if (objectsFieldList.length > 0) {
                    $scope.listAvailableDataObject = [];
                    if ($scope.authenticated) {
                        AuthService.getWorkspaces($scope.currentUser.id)
                            .then(function (wks) {
                                $scope.pushDataObjects(wks, function () {
                                    angular.forEach(configJSON, function (field, index) {
                                        if (field.type === 'dataobject') {
//                                            configJSON[index].availableData = $scope.listAvailableDataObject;
//                                            console.debug(JSON.stringify(configJSON[index].availableData));
                                            configJSON[index].availableData = [
                                                {
                                                    'type': 'object',
                                                    'name': 'test.txt',
                                                    'label': 'test.txt',
                                                    'modification': 1413878591735,
                                                    'mimeType': 'text/plain',
                                                    'key': 'd3c8bfb2-f495-476d-abc0-099642f079f8'
                                                },
                                                {
                                                    'type': 'object',
                                                    'name': 'bootstrap.txt',
                                                    'label': 'bootstrap.txt',
                                                    'modification': 1413878556410,
                                                    'mimeType': 'text/plain',
                                                    'key': '541f61b1-958b-45ac-ad58-0ca50bca7f33'
                                                }
                                            ];
                                        }
                                    });
                                });
                            });
                    }
                }
//                angular.forEach(objectsFieldList, function (field) {
//                    $scope.formFields.concat('{key: \'hidden_' + field.key + '\', type: \'hidden\' }');
//                });
            };


            /**
             * Generate the form
             * @param configJSON
             */
            $scope.generateForm = function (configJSON) {
                // ajoute les template ortolang
                formlyTemplate.setTemplateUrl('select', 'views/ortolang-formly-select.html');
                formlyTemplate.setTemplateUrl('dataobject', 'views/ortolang-formly-typeahead.html');

                $scope.formData = {};
                $scope.formFields = configJSON;
                $scope.formOptions = {
                    //Set the id of the form
                    uniqueFormId: 'pluginConfig',
                    //Hide the submit button that is added automatically
                    //default: false
                    hideSubmit: false,
                    //Set the text on the default submit button
                    //default: Submit
                    submitCopy: 'Save and Run'
                };
            };


            /**
             * Action to perform on submit
             */
            $scope.onSubmit = function () {
                console.log('form submitted:', $scope.formData);

                var deferred = $q.defer(), promise;
                $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
                promise = PluginsResource.postConfig({pKey: $routeParams.plName}, $scope.formData);

                $q.all(promise).then(function (data) {
                    console.log('data:', data);
                    PluginsResource.invoke({pKey: $routeParams.plName},
                        function (response) {
                            console.log('reponse invoke:', response);
                            $scope.preview = response.output;
                            $scope.downloadUrl = Url.urlBase() + '/rest/plugins/' + $routeParams.plName + '/download?path=' + response.urlResult;
                        },
                        function (error) {
                            console.log(error);
                        });
                });
                deferred.resolve();
            };

            // INIT :
            $scope.plName = $routeParams.plName;
            $scope.plugin = null;
            $scope.preview = null;
            $scope.downloadUrl = null;
            $scope.loadPlugin();
            $scope.loadConfig();
        }]);