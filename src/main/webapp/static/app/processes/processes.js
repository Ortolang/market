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

            $scope.showToolLog = function (job) {
                Runtime.selectToolJob(job);
                $modal({
                    title: job.toolName,
                    html: true,
                    scope: $scope,
                    template: 'processes/process-log-modal-template.html',
                    show: true
                });
            };

            $scope.abortToolJob = function (job) {
                Runtime.selectProcess(job);
                ToolManager.getTool(job.toolKey).abortJob(job.id).$promise.then(
                    function () {
                        $alert({title: job.toolName, content: 'annulé', placement: 'top-right', type: 'success', show: true});
                    },
                    function () {
                        $alert({title: job.toolName, content: 'pas annulé', placement: 'top-right', type: 'danger', show: true});
                    }
                );
            };

            $scope.showToolParam = function (job) {
                Runtime.selectToolJob(job);
                $modal({
                    title: job.toolName,
                    html: true,
                    scope: $scope,
                    template: 'common/tools/tool-tpl-parameters.html',
                    show: true
                });
            };

            $scope.showResult = function (job) {
                Runtime.selectProcess(job);
                ToolManager.getTool(job.toolKey).getResult(job.id).$promise.then(function (data) {
                    $scope.results = data;
                    $scope.jname = job.toolName;
                    $scope.job = job;
                    $modal({
                        title: job.toolName,
                        html: true,
                        scope: $scope,
                        template: 'common/tools/tool-result-modal-template.html',
                        show: true
                    });
                });

            };

            $scope.activeTab = 0;

            $scope.showAll = function ($event) {
                $($event.target).addClass('hidden').prev('table').addClass('show-all');
            };
        }]);
