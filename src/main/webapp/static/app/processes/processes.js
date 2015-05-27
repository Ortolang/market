'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$scope', '$modal', '$routeParams', 'Runtime', 'ToolManager', '$alert', '$rootScope',
        function ($scope, $modal, $routeParams, Runtime, ToolManager, $alert, $rootScope) {

            $scope.Runtime = Runtime;

            $scope.completedProcessessDisplayed = 3;
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
                        $alert({title: process.processTool.name, content: 'annulé', placement: 'top-right', type: 'success', show: true});
                    },
                    function () {
                        $alert({title: process.processTool.name, content: 'pas annulé', placement: 'top-right', type: 'danger', show: true});
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
                    console.debug(data);
                    $scope.results = data;
                    $scope.jobId = process.jobId;
                    $scope.toolKey = process.toolKey;
                    $scope.jname = process.processTool.name;
                    $scope.process = process;
                    $scope.switchStatus = [];
                    $scope.maxProcessLogHeight = (window.innerHeight - 170) + 'px';
                    $scope.log = process.log;
                    //$modal({
                    //    title: process.processTool.name,
                    //    html: true,
                    //    scope: $scope,
                    //    template: 'common/tools/tool-result-modal-template.html',
                    //    show: true
                    //});
                    $rootScope.$broadcast('tool-results-show');
                });
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

            $scope.test = function () {
                Runtime.createProcess({
                    'process-type': 'test',
                    'process-name': 'Test process',
                    'name': 'John'
                });
            };
        }]);
