'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsListCtrl
 * @description
 * # ToolsListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', function ($scope, ToolManager, $rootScope, $translate) {

        // ***************** //
        // Editor visibility //
        // ***************** //

        $scope.visibility = false;

        $scope.show = function () {
            $scope.visibility = true;
            // $scope.resizeAsideBody();
        };

        $scope.hide = function () {
            $scope.visibility = false;
            // resetMetadataFormat();
        };

        $scope.toggle = function () {
            if ($scope.visibility === true) {
                $scope.hide();
            } else {
                $scope.show();
            }
        };

        $scope.isShow = function () {
            return $scope.visibility === true;
        };

        // Tools list //

        $scope.selectTool = function (tool) {
            $scope.selectedTool = tool;
            ToolManager.checkGrant(tool.getKey()).then(function () {
                $scope.loadConfig();
            });
        };

        $scope.resetSelectedTool = function () {
            $scope.selectedTool = undefined;
        };

        $scope.hasToolSelected = function () {
            return $scope.selectedTool !== undefined;
        };

        $scope.loadToolsList = function () {
            $scope.tools = ToolManager.getRegistry();
        };

        $scope.loadConfig = function () {
            ToolManager.getTool($scope.selectedTool.getKey()).getExecutionForm().$promise.then(
                function success(config) {
                    $scope.generateForm(config);
                },
                function error(msg) {
                    console.error('The tool server for "%s" is not responding.', $scope.selectedTool.getName(), msg);
                    $scope.formData = undefined;
                }
            );
        };

        $scope.hasToolConfig = function () {
            return $scope.formData !== undefined;
        };

        $scope.generateForm = function (configJSON) {
            $scope.formData = {};
            $scope.formFields = configJSON;
            $scope.formOptions = {
                uniqueFormId: 'toolConfig',
                hideSubmit: false,
                submitCopy: $translate.instant('TOOLS.RUN_TOOL')
            };
        };


        // ***************** //
        // Alert visibility //
        // ***************** //

        $scope.fail = false;
        $scope.failMsg = undefined;

        $scope.showError = function (msg) {
            $scope.fail = true;
            $scope.failMsg = msg;
        };

        $scope.hideError = function () {
            $scope.fail = false;
        };

        $scope.isShowError = function () {
            return $scope.fail === true;
        };


        // ********* //
        // Listeners //
        // ********* //

        $scope.$on('tools-list-show', function () {
            $scope.resetSelectedTool();
            $scope.show();
        });

        $scope.onSubmit = function () {
            ToolManager.getTool($scope.selectedTool.getKey()).createJob($scope.formData).$promise.then(
                function success() {
                    $rootScope.$broadcast('tool-job-created');
                    $scope.hide();
                },
                function error(msg) {
                    console.error('An error happens while trying to run "%s".', $scope.selectedTool.getName(), msg);
                    $scope.showError(msg);
                }
            );
        };

        function init() {
            $scope.tools = [];
            $scope.loadToolsList();
            $scope.selectedTool = undefined;
        }

        init();
    }]);
