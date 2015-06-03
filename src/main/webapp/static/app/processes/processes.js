'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$scope', '$modal', '$routeParams', 'Runtime', 'ToolManager', '$alert', '$rootScope', '$filter',
        function ($scope, $modal, $routeParams, Runtime, ToolManager, $alert, $rootScope, $filter) {

            $scope.Runtime = Runtime;

            $scope.completedProcessessDisplayed = 3;
            $scope.abortedProcessessDisplayed = 3;
            $scope.processessDisplayed = 10;
            // Filter set by default to start date in descending order
            $scope.orderProp = 'stop';
            $scope.orderReverse = true;

            var name;

            $scope.showLog = function (process, processKey) {
                if (processKey) {
                    process = Runtime.selectProcessByKey(processKey);
                } else if(process.hasOwnProperty('processTool')) {
                    Runtime.selectRemoteProcess(process);
                    name = process.processTool.name;
                } else {
                    Runtime.selectProcess(process);
                    name = process.name;
                }
                if (process) {
                    $scope.maxProcessLogHeight = (window.innerHeight - 170) + 'px';
                    $modal({
                        title: name,
                        html: true,
                        scope: $scope,
                        template: 'processes/process-log-modal-template.html',
                        show: true
                    });
                }
            };


            $scope.abortToolJob = function (process) {
                Runtime.selectRemoteProcess(process);
                ToolManager.getTool(process.toolKey).abortJob(process.jobId).$promise.then(
                    function () {
                        $alert({title: process.processTool.name, content: 'annulé', type: 'success'});
                    },
                    function () {
                        $alert({title: process.processTool.name, content: 'pas annulé', type: 'danger'});
                    }
                );
            };

            $scope.showToolParam = function (process) {
                Runtime.selectRemoteProcess(process);
                $modal({
                    title: process.processTool.name,
                    html: true,
                    scope: $scope,
                    template: 'common/tools/tool-tpl-parameters.html',
                    show: true
                });
            };

            $scope.showResult = function (process) {
                Runtime.selectRemoteProcess(process);
                ToolManager.getTool(process.toolKey).getResult(process.jobId).$promise.then(function (data) {
                    $scope.results = data;
                    $scope.jobId = process.jobId;
                    $scope.toolKey = process.toolKey;
                    $scope.jname = process.processTool.name;
                    $scope.process = process;
                    $scope.switchStatus = [];
                    $scope.maxProcessLogHeight = (window.innerHeight - 170) + 'px';
                    $scope.log = process.log;
                    $rootScope.$broadcast('tool-results-show');
                });
            };

            $scope.filteredOrderedProcesses = function (processes) {
                return $filter('orderBy')(processes, $scope.orderProp, $scope.orderReverse);
            };

            $scope.order = function (predicate, reverse) {
                $scope.orderReverse = reverse === 'toggle' ? !$scope.orderReverse : reverse;
                $scope.orderProp = predicate;
            };


            $scope.activeTab = 0;

            $scope.showAll = function ($event) {
                $($event.target).addClass('hidden').prev('table').addClass('show-all');
            };

            $scope.getToolDownloadUrl = function (url, jobid, path) {
                return url + '/jobs/' + jobid + '/download?path=' + path;
            };

            if ($routeParams.pKey) {
                $scope.showLog(undefined, $routeParams.pKey);
            }


            //$scope.test = function () {
            //    Runtime.createProcess({
            //        'process-type': 'test',
            //        'process-name': 'Test process',
            //        'name': 'John'
            //    });
            //};
        }]);
