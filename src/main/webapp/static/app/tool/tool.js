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
        '$rootScope',
        function ($scope, $routeParams, $filter, WorkspaceElementResource, ToolManager, $rootScope) {

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
             * Generate the form
             * @param configJSON
             */
            $scope.generateForm = function (configJSON) {
                $scope.formData = {};
                $scope.formFields = configJSON;
                $scope.formOptions = {
                    uniqueFormId: 'toolConfig',
                    hideSubmit: false,
                    submitCopy: 'Save and Run'
                };
                console.log('$$childHead', $scope.$$childHead);
            };


            // EVENT :

            /**
             * Action to perform on submit
             */
            $scope.onSubmit = function () {
                ToolManager.getTool(toolKey).createJob($scope.formData).$promise.then(function (response) {
                    console.log(response);
                });
            };

            /**
             * Action to perform on language update
             */
            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.init();
            });


            // INIT :

            $scope.init = function(){
                $scope.tool = undefined;
                $scope.preview = undefined;
                $scope.downloadUrl = null;
                $scope.viewLoading = false;
                $scope.loadToolDefinition();
                $scope.loadConfig();
            };

            $scope.init();

        }]);
