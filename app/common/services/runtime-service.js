'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Runtime
 * @description
 * # Runtime
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Runtime', ['$rootScope', '$filter', '$timeout', '$modal', '$alert', '$translate', 'FormResource', 'RuntimeResource', function ($rootScope, $filter, $timeout, $modal, $alert, $translate, FormResource, RuntimeResource) {

        var translationsStartProcess, translationsCompleteTask, translationsProcess, translationsJustCompleted, processModal, completeTaskModal, processesTimeout, tasksTimeout,
            states = {
                pending: 'PENDING',
                submitted: 'SUBMITTED',
                running: 'RUNNING',
                suspended: 'SUSPENDED',
                aborted: 'ABORTED',
                completed: 'COMPLETED'
            },
            timeout = 5000,
            activeProcesses = [],
            completedProcesses;

        function createProcessFromForm(formKey, template) {
            FormResource.get({formKey: formKey}, {}, function (form) {
                var modalScope = $rootScope.$new();
                modalScope.formData = {};
                modalScope.formFields = JSON.parse(form.definition);
                modalScope.formOptions = {
                    uniqueFormId: formKey,
                    submitCopy: translationsStartProcess
                };
                modalScope.onSubmit = function () {
                    RuntimeResource.createProcess(modalScope.formData, function () {
                        forceRefresh();
                    });
                    processModal.hide();
                };
                processModal = $modal({
                    title: form.name,
                    html: true,
                    scope: modalScope,
                    template: template || '/common/services/runtime-form-modal-template.html',
                    show: true
                });
            });
        }

        function getStates() {
            return states;
        }

        function createProcess(data) {
            RuntimeResource.createProcess(data, function () {
                forceRefresh();
            });
        }

        function selectProcess(process) {
            $rootScope.selectedProcess = process;
        }

        function getActiveProcesses() {
            return $filter('filter')($rootScope.processes, function (value) {
                return !(value.state === states.completed || value.state === states.aborted);
            });
        }

        function activeProcessesNumber() {
            if ($rootScope.processes) {
                return getActiveProcesses().length;
            }
            return 0;
        }

        function hasActiveProcesses() {
            return activeProcessesNumber() > 0;
        }

        function getProcessesWithState(state, not) {
            if ($rootScope.processes) {
                return $filter('filter')($rootScope.processes, {state: (not ? '!' : '') + state});
            }
            return [];
        }

        function hasProcessesWithState(state) {
            if ($rootScope.processes) {
                var i;
                for (i = 0; i < $rootScope.processes.length; i++) {
                    if ($rootScope.processes[i].state === state) {
                        return true;
                    }
                }
            }
            return false;
        }

        function refreshProcesses() {
            RuntimeResource.processes().$promise.then(function (data) {
                $rootScope.processes = data.entries;
                completedProcesses = getProcessesWithState(states.completed);
                var justCompletedProcesses = $filter('filter')(activeProcesses, function (activeProcess) {
                    return $filter('filter')(completedProcesses, {key: activeProcess.key}).length > 0;
                });
                angular.forEach(justCompletedProcesses, function (justCompletedProcess) {
                    $alert({title: translationsProcess, content: justCompletedProcess.name + translationsJustCompleted, placement: 'top-right', type: 'success', show: true});
                    if (justCompletedProcess.type === 'publish-workspace') {
                        $rootScope.$broadcast('publishWorkspaceCompleted');
                    }
                });
                activeProcesses = getActiveProcesses();
                $rootScope.activeProcessesNbr = activeProcesses.length;
                if ($rootScope.activeProcessesNbr === 0) {
                    $timeout.cancel(processesTimeout);
                    $timeout.cancel(tasksTimeout);
                }
                if ($rootScope.selectedProcess) {
                    $rootScope.selectedProcess = $filter('filter')($rootScope.processes, {key: $rootScope.selectedProcess.key})[0];
                }
            });
            processesTimeout = $timeout(refreshProcesses, timeout);
        }

        function forceRefreshProcesses(delay) {
            if (processesTimeout) {
                $timeout.cancel(processesTimeout);
            }
            if (delay) {
                $timeout(refreshProcesses, delay);
            } else {
                refreshProcesses();
            }
        }

        // *********************** //
        //          Tasks          //
        // *********************** //

        function refreshTasks() {
            RuntimeResource.tasks().$promise.then(function (data) {
                $rootScope.tasks = data.entries;
            });
            tasksTimeout = $timeout(refreshTasks, timeout);
        }

        function forceRefreshTasks(delay) {
            if (tasksTimeout) {
                $timeout.cancel(tasksTimeout);
            }
            if (delay) {
                $timeout(refreshTasks, delay);
            } else {
                refreshTasks();
            }
        }

        function claimTask(task) {
            RuntimeResource.claimTask({tId: task.id}, {}, function () {
                forceRefreshTasks();
            });
        }

        function completeTask(task) {
            FormResource.get({formKey: task.form}, {}, function (form) {
                var modalScope = $rootScope.$new();
                modalScope.formData = {};
                modalScope.formFields = JSON.parse(form.definition);
                modalScope.formOptions = {
                    uniqueFormId: task.form + '-' + task.id,
                    submitCopy: translationsCompleteTask
                };
                modalScope.onSubmit = function () {
                    var variables = [], type;
                    angular.forEach(Object.keys(modalScope.formData), function (key) {
                        if (modalScope.formData[key] === true || modalScope.formData[key] === false) {
                            type = 'boolean';
                        } else if (angular.isString(modalScope.formData[key])) {
                            type = 'string';
                        }
                        variables.push({name: key, value: modalScope.formData[key], type: type});
                    });
                    RuntimeResource.completeTask({tId: task.id}, {'variables':  variables}, function () {
                        forceRefreshTasks();
                    });
                    completeTaskModal.hide();
                };
                completeTaskModal = $modal({
                    title: form.name,
                    html: true,
                    scope: modalScope,
                    template: '/common/services/runtime-form-modal-template.html',
                    show: true
                });
            });
        }

        // *********************** //
        //          Events         //
        // *********************** //

        $rootScope.$on('$translateChangeSuccess', function () {
            initTranslations();
        });

        function forceRefresh(delay) {
            forceRefreshProcesses(delay);
            forceRefreshTasks(delay);
        }

        $rootScope.$on('process-created', function () {
            forceRefresh();
        });

        // *********************** //
        //           Init          //
        // *********************** //

        function initTranslations() {
            $translate([
                'PROCESSES.START_PROCESS',
                'PROCESSES.COMPLETE_TASK',
                'PROCESSES.PROCESS',
                'PROCESSES.JUST_COMPLETED'
            ]).then(function (translations) {
                translationsStartProcess = translations['PROCESSES.START_PROCESS'];
                translationsCompleteTask = translations['PROCESSES.COMPLETE_TASK'];
                translationsProcess = translations['PROCESSES.PROCESS'];
                translationsJustCompleted = translations['PROCESSES.JUST_COMPLETED'];
            });
        }

        function init() {
            initTranslations();
            refreshProcesses();
            refreshTasks();
        }
        init();

        return {
            // Processes
            createProcessFromForm: createProcessFromForm,
            createProcess: createProcess,
            selectProcess: selectProcess,
            activeProcessesNumber: activeProcessesNumber,
            getActiveProcesses: getActiveProcesses,
            hasActiveProcesses: hasActiveProcesses,
            hasProcessesWithState: hasProcessesWithState,
            getProcessesWithState: getProcessesWithState,
            getStates: getStates,
            // Tasks
            claimTask: claimTask,
            completeTask: completeTask
        };
    }]);
