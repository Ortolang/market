'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolCtrl
 * @description
 * # ToolCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolCtrl', [
        '$scope',
        '$routeParams',
        '$filter',
        'WorkspaceElementResource',
        'ToolManager',
        '$q',
        function ($scope, $routeParams, $filter, WorkspaceElementResource, ToolManager, $q) {

            var toolKey = $routeParams.toolKey;

            /**
             * Load tool definition
             */
            $scope.loadToolDefinition = function () {
                ToolManager.getTool(toolKey).getDefinition().$promise.then(function (data) {
                    $scope.tool = data;
                });
            };

            /**
             * Load config JSON form for the tool
             */
            $scope.loadConfig = function () {
                ToolManager.getTool(toolKey).getExecutionForm().$promise.then(function (config) {
                    $scope.generateForm(config);
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
                console.log('$$childHead', $scope.$$childHead);
            };

            /**
             * Action to perform on submit
             */
            $scope.onSubmit = function () {
                ToolManager.getTool(toolKey).createJob($scope.formData).$promise.then(function (response) {
                    console.log(response);
                });
                //console.log('form submitted:', $scope.formData);
                //ToolsResource.postConfig({pKey: $routeParams.plName}, $scope.formData,
                //    function (response) {
                //        $scope.viewLoading = false;
                //        $scope.log = '##' + $filter('date')(response.start, 'mediumTime') + '<br>' + response.log + '<br>##' + $filter('date')(response.stop, 'mediumTime');
                //        //console.log('reponse invoke:', response);
                //        if (response.status === 'SUCCESS') {
                //            $scope.success = true;
                //            $scope.resultStatus = response.status;
                //            $scope.preview = response.output;
                //            $scope.listFileResult = [];
                //            angular.forEach(response.outputFilePath, function (file, fileName) {
                //                $scope.listFileResult.push(
                //                    {
                //                        downloadUrl : Url.urlBase() + '/rest/tools/' + $routeParams.plName + '/download?path=' + file + '&name=' + fileName,
                //                        resFileName : fileName
                //                    }
                //                );
                //            });
                //        } else {
                //            $scope.success = false;
                //            $scope.resultStatus = response.status;
                //            $scope.preview = response.status;
                //        }
                //    });
            };

            // INIT :
            $scope.tool = undefined;
            $scope.preview = undefined;
            $scope.downloadUrl = null;
            $scope.viewLoading = false;
            $scope.loadToolDefinition();
            $scope.loadConfig();

        }]);
