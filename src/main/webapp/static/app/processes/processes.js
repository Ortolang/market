'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$scope', '$modal', 'Runtime', 'ToolManager', '$alert',
        function ($scope, $modal, Runtime, ToolManager, $alert) {

            $scope.Runtime = Runtime;

            $scope.completedProcessessDisplayed = 3;

            $scope.showLog = function (process) {
                Runtime.selectProcess(process);
                $modal({
                    title: process.name,
                    html: true,
                    scope: $scope,
                    template: 'processes/process-log-modal-template.html',
                    show: true
                });
            };

            $scope.showToolLog = function (toolJob) {
                Runtime.selectToolJob(toolJob);
                console.debug(toolJob.log);
                $modal({
                    title: toolJob.name,
                    html: true,
                    scope: $scope,
                    template: 'processes/process-log-modal-template.html',
                    show: true
                });
            };

            $scope.abortToolJob = function (toolJob) {
                Runtime.selectProcess(toolJob);
                ToolManager.getTool(toolJob.key).abortJob(toolJob.id).$promise.then(
                    function success() {
                        $alert({title: toolJob.name, content: 'annulé', placement: 'top-right', type: 'success', show: true});
                    },
                    function error() {
                        $alert({title: toolJob.name, content: 'pas annulé', placement: 'top-right', type: 'danger', show: true});
                    }
                );
            };

            $scope.showToolParam = function (toolJob) {
                Runtime.selectToolJob(toolJob);
                $modal({
                    title: toolJob.name,
                    html: true,
                    scope: $scope,
                    template: 'tool/tool-tpl-parameters.html',
                    show: true
                });
            };

            $scope.showResult = function (toolJob) {
                Runtime.selectProcess(toolJob);
                ToolManager.getTool(toolJob.key).getResult(toolJob.id).$promise.then(function (data) {
                    $scope.results = data;
                    $scope.jname = toolJob.name;
                    $scope.job = toolJob;
                    $modal({
                        title: toolJob.name,
                        html: true,
                        scope: $scope,
                        template: 'tool/tool-result-modal-template.html',
                        show: true
                    });
                });

            };

            $scope.activeTab = 0;

            $scope.showAll = function ($event) {
                $($event.target).addClass('hidden').prev('table').addClass('show-all');
            };
        }]);
