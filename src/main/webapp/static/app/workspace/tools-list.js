'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsListCtrl
 * @description
 * # ToolsListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', '$alert', function ($scope, ToolManager, $rootScope, $translate, $alert) {

        var saveBt, successJob;

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

        $scope.selectTool = function(tool) {
            $scope.selectedTool = tool;
            $scope.loadConfig();
        };

        $scope.resetSelectedTool = function() {
            $scope.selectedTool = undefined;
        };

        $scope.hasToolSelected = function() {
            return $scope.selectedTool !== undefined;
        };

        $scope.loadToolsList = function() {
            $scope.tools = ToolManager.getRegistry();
        };

        $scope.loadConfig = function () {
            ToolManager.getTool($scope.selectedTool.getKey()).getExecutionForm().$promise.then(
                function success (config) {
                    $scope.generateForm(config);
                },
                function error (error) {
                    console.error('The tool server for "%s" is not responding.', $scope.selectedTool.getName(), error);
                    $scope.formData = undefined;
                }
            );
        };

        $scope.hasToolConfig = function() {
            return $scope.formData !== undefined;
        };

        $scope.generateForm = function (configJSON) {
            $scope.formData = {};
            $scope.formFields = configJSON;
            $scope.formOptions = {
                uniqueFormId: 'toolConfig',
                hideSubmit: false,
                submitCopy: saveBt
            };
        };


        // ***************** //
        // Alert visibility //
        // ***************** //

        $scope.fail = false;

        $scope.showError = function () {
            $scope.fail = true;
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
                function success(response) {
                    console.log(response);
                    $rootScope.$broadcast('tool-job-created');
                    $scope.hide();
                    $alert({title: $scope.selectedTool.getName(), content: successJob, placement: 'top-right', type: 'success', show: true});
                },
                function error(error) {
                    console.error('An error happens while trying to run "%s".', $scope.selectedTool.getName(), error);
                    $scope.showError();
                }
            );
        };

        $rootScope.$on('$translateChangeSuccess', function () {
            initTranslations();
        });

        function initTranslations() {
            $translate([
                'TOOLS.RUN_TOOL',
                'TOOLS.WAS_SUCCESS'
            ]).then(function (translations) {
                saveBt = translations['TOOLS.RUN_TOOL'];
                successJob = translations['TOOLS.WAS_SUCCESS'];
            });

        }

        function init() {
            initTranslations();
            $scope.tools = [];
            $scope.loadToolsList();
            $scope.selectedTool = undefined;
        }

        init();
    }]);
