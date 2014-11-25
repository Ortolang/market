'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$rootScope', '$scope', '$modal', '$filter', '$timeout', 'RuntimeResource', function ($rootScope, $scope, $modal, $filter, $timeout, RuntimeResource) {

        $scope.states = {
            pending: 'PENDING',
            submitted: 'SUBMITTED',
            running: 'RUNNING',
            suspended: 'SUSPENDED',
            aborted: 'ABORTED',
            completed: 'COMPLETED'
        };

        var timeout = 5000, processesTimeout, tasksTimeout;

        function refreshProcesses() {
            RuntimeResource.processes().$promise.then(function (data) {
                $scope.processes = data;
                $rootScope.activeProcessesNbr = activeProcessesNumber();
            });
            processesTimeout = $timeout(refreshProcesses, timeout);
        }

        function refreshTasks() {
            RuntimeResource.tasks().$promise.then(function (data) {
                $scope.tasks = data;
            });
            tasksTimeout = $timeout(refreshTasks, timeout);
        }

        refreshProcesses();
        refreshTasks();

        function activeProcessesNumber() {
            if ($scope.processes) {
                return ($filter('filter')($scope.processes.entries, {state : '!' + $scope.states.completed})).length;
            }
            return 0;
        }

        $scope.hasActiveProcesses = function () {
            if ($scope.processes) {
                return activeProcessesNumber() > 0;
            }
            return false;
        };

        $scope.hasProcessesOfType = function (type) {
            if ($scope.processes && $scope.states[type]) {
                return ($filter('filter')($scope.processes.entries, {state: $scope.states[type]})).length > 0;
            }
            return false;
        };

        $scope.showLog = function (process) {
            if (process) {
                var modalScope = $rootScope.$new();
                modalScope.log = process.log;
                $modal({
                    title: process.name,
                    html: true,
                    scope: modalScope,
                    template: '/processes/process-log-modal-template.html',
                    show: true
                });
            }
        };

        $scope.$on('$destroy', function () {
            $timeout.cancel(processesTimeout);
            $timeout.cancel(tasksTimeout);
            $rootScope.activeProcessesNbr = undefined;
        });

        $scope.test = function () {
            RuntimeResource.createProcess({'process-name': 'Hello World process test', 'process-type': 'test', name: 'Bob'});
        };

        $scope.claim = function (task) {
            RuntimeResource.claimTask({tId: task.id}, {});
        };

        $scope.complete = function (task, value) {
            RuntimeResource.completeTask({tId: task.id}, {'variables':  [ {'name': 'helloAgain', 'value': value, 'type': 'boolean' } ]});
        };
    }]);
