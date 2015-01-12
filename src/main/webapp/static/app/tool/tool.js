'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolCtrl
 * @description
 * # ToolCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolCtrl', [ '$scope',
        '$http',
        'PluginsResource',
        'ToolsResource',
        '$routeParams',
        '$filter',
        'WorkspaceElementResource',
        '$q',
        'Url',
        '$resource',
        function ($scope, $http, PluginsResource, ToolsResource, $routeParams, formlyTemplate, $filter, WorkspaceElementResource, $q, Url, $resource) {

            /**
             * Load chosen tool
             */
            $scope.loadTool = function () {
                PluginsResource.getTool({pKey: $routeParams.plName},
                    function (tool) {
                        $scope.toolUrl = tool.url;
                        $scope.loadToolDesc();
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            };

            /**
             * Load chosen plugin informations
             */
            $scope.loadToolDesc = function () {
                var desc = $resource($scope.toolUrl + '/description', {}, {
                    getDesc: {method: 'GET', isArray: false}
                });
                desc.getDesc(
                    function (toolDesc) {
                        $scope.tool = toolDesc;
                        $scope.loadConfig();
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            };

            /**
             * Load config JSON form for the tool
             * @return {*[]}
             */
            $scope.loadConfig = function () {
                var config = $resource($scope.toolUrl + '/execution-form', {}, {
                    getConfig: {method: 'GET', isArray: true}
                });
                config.getConfig(
                    function (toolConfig) {
                        $scope.generateForm(toolConfig);
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            };

            /**
             * Push object from workspace in an array
             * @param workspaces
             * @param callback
             */
            $scope.pushDataObjects = function (workspaces, callback) {
                var deferred = $q.defer(), promise = [], list = [];
                workspaces.forEach(function (index) {
                    promise.push(WorkspaceElementResource.get({wskey: index.key, path: '/', root: 'head'}).$promise
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
             * Generate the form
             * @param configJSON
             */
            $scope.generateForm = function (configJSON) {
                $scope.formData = {};
                $scope.formFields = configJSON;
                $scope.formOptions = {
                    //Set the id of the form
                    uniqueFormId: 'toolConfig',
                    //Hide the submit button that is added automatically
                    //default: false
                    hideSubmit: false,
                    //Set the text on the default submit button
                    //default: Submit
                    submitCopy: 'Save and Run'
                };
                console.log('$$childHead', $scope.$$childHead);
            };

            /**
             * Action to perform on submit
             */
            $scope.onSubmit = function () {
                console.log('form submitted:', $scope.formData);
                var submit = $resource($scope.toolUrl + '/jobs', {}, {
                    submitJob: {
                        method: 'POST',
                        transformRequest: function (data) {
                            return $.param(data);
                        },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }
                });
                submit.submitJob({}, $scope.formData,
                    function (response) {
                        //$scope.log = '##' + $filter('date')(response.start, 'mediumTime') + '<br>' + response.log + '<br>##' + $filter('date')(response.stop, 'mediumTime');
                        ////console.log('reponse invoke:', response);
                        //if (response.status === 'SUCCESS') {
                        //    $scope.success = true;
                        //    $scope.resultStatus = response.status;
                        //    $scope.preview = response.output;
                        //    $scope.listFileResult = [];
                        //    angular.forEach(response.outputFilePath, function (file, fileName) {
                        //        $scope.listFileResult.push(
                        //            {
                        //                downloadUrl : Url.urlBase() + '/rest/tools/' + $routeParams.plName + '/download?path=' + file + '&name=' + fileName,
                        //                resFileName : fileName
                        //            }
                        //        );
                        //    });
                        //} else {
                        //    $scope.success = false;
                        //    $scope.resultStatus = response.status;
                        //    $scope.preview = response.status;
                        //}
                    });
            };


            // INIT :
            $scope.plName = $routeParams.plName;
            $scope.toolUrl = null;
            $scope.tool = null;
            $scope.preview = null;
            $scope.downloadUrl = null;
            $scope.loadTool();
        }]);
