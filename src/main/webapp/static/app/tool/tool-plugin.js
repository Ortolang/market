'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolPluginCtrl
 * @description
 * # ToolPluginCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolPluginCtrl', [ '$scope',
        '$http',
        'ToolsResource',
        '$routeParams',
        'formlyTemplate',
        '$filter',
        'WorkspaceElementResource',
        '$q',
        'Url',
        function ($scope, $http, ToolsResource, $routeParams, formlyTemplate, $filter, WorkspaceElementResource, $q, Url, AuthService) {
            /**
             * Load chosen plugin informations
             */
            $scope.loadTool = function () {
                ToolsResource.getToolDiffusion({pKey: $routeParams.plName},
                    function (tool) {
                        $scope.tool = tool;
                    },
                    function (error) {
                        console.log(error);
                    });
            };

            /**
             * Load config JSON form for the tool
             * @return {*[]}
             */
            $scope.loadConfig = function () {
                ToolsResource.getConfigDiffusion({pKey: $routeParams.plName},
                    function (config) {
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
            };

            /**
             * Action to perform on submit
             */
            $scope.onSubmit = function () {
                $scope.viewLoading = true;
                //console.log('form submitted:', $scope.formData);
                ToolsResource.postConfigDiffusion({pKey: $routeParams.plName}, $scope.formData,
                    function (response) {
                        $scope.viewLoading = false;
                        //console.log('reponse invoke:', response);
                        $scope.log = '##' + $filter('date')(response.start, 'mediumTime') + '<br>' + response.log + '<br>##' + $filter('date')(response.stop, 'mediumTime');
                        if (response.status === 'SUCCESS') {
                            $scope.success = true;
                            $scope.resultStatus = response.status;
                            $scope.preview = response.output;
                            $scope.listFileResult = [];
                            angular.forEach(response.outputFilePath, function (file, fileName) {
                                $scope.listFileResult.push(
                                    {
                                        downloadUrl : Url.urlBase() + '/rest/tools/' + $routeParams.plName + '/download?path=' + file + '&name=' + fileName,
                                        resFileName : fileName
                                    }
                                );
                            });
                        } else {
                            $scope.success = false;
                            $scope.resultStatus = response.status;
                            $scope.preview = response.status;
                        }
                    });
            };


            // INIT :
            $scope.plName = $routeParams.plName;
            $scope.tool = null;
            $scope.preview = null;
            $scope.downloadUrl = null;
            $scope.viewLoading = false;
            $scope.loadTool();
            $scope.loadConfig();

        }]);
