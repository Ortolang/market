'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Runtime
 * @description
 * # Runtime
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('Runtime', [
        '$rootScope',
        '$filter',
        '$timeout',
        '$modal',
        '$alert',
        '$translate',
        'AuthService',
        'FormResource',
        'RuntimeResource',
        'AtmosphereService',
        'ToolManager',
        'User',
        '$q',
        function ($rootScope, $filter, $timeout, $modal, $alert, $translate, AuthService, FormResource, RuntimeResource, AtmosphereService, ToolManager, User, $q) {

            var processes = [],
                tasks = [],
                toolJobs = [],
                processModal,
                completeTaskModal,
                toolJobsTimeout,
                states = {
                    pending: 'PENDING',
                    submitted: 'SUBMITTED',
                    running: 'RUNNING',
                    suspended: 'SUSPENDED',
                    aborted: 'ABORTED',
                    completed: 'COMPLETED'
                },
                toolJobStatus = {
                    pending: 'PENDING',
                    running: 'RUNNING',
                    completed: 'SUCCESS',
                    error: 'ERROR',
                    canceled: 'ABORTED'
                },
                lastTasksRefresh,
                lastProcessesRefresh,
                timeout = 5000,
                activeProcesses = [],
                activeToolJobs = [],
                history = {},
                completedToolJobs;


            // *********************** //
            //       Subscription      //
            // *********************** //

            function subscribeToProcesses(processesToSubscribeTo) {
                if (!angular.isArray(processesToSubscribeTo)) {
                    processesToSubscribeTo = [processesToSubscribeTo];
                }
                angular.forEach(processesToSubscribeTo, function (process) {
                    AtmosphereService.addFilter({typePattern: 'runtime\\.process\\..*', fromPattern: process.key});
                });
            }

            function initialSubscriptions() {
                AuthService.sessionInitialized().then(function () {
                    AtmosphereService.addFilter({typePattern: 'runtime\\.process\\.create', throwedByPattern: User.key});
                    angular.forEach(User.groups, function (group) {
                        AtmosphereService.addFilter({typePattern: 'runtime\\.task\\..*', argumentsPatterns: {group: group}});
                    });
                    AtmosphereService.addFilter({typePattern: 'runtime\\.task\\..*', argumentsPatterns: {user: User.key}});
                });
            }

            // *********************** //
            //        Processes        //
            // *********************** //

            function pushNewProcess(process) {
                processes.push(process);
                if (process.state !== states.completed && process.state !== states.aborted) {
                    activeProcesses.push(process);
                    subscribeToProcesses(process);
                }
            }

            function createProcessFromForm(formKey, template) {
                FormResource.get({formKey: formKey}, {}, function (form) {
                    var modalScope = $rootScope.$new();
                    modalScope.formData = {};
                    modalScope.formFields = JSON.parse(form.definition);
                    modalScope.formOptions = {
                        uniqueFormId: formKey,
                        submitCopy: $translate.instant('PROCESSES.START_PROCESS')
                    };
                    modalScope.onSubmit = function () {
                        RuntimeResource.createProcess(modalScope.formData, function (process) {
                            pushNewProcess(process);
                        });
                        processModal.hide();
                    };
                    processModal = $modal({
                        title: form.name,
                        html: true,
                        scope: modalScope,
                        template: template || 'common/services/runtime-form-modal-template.html',
                        show: true
                    });
                });
            }

            function getStates() {
                return states;
            }

            function createProcess(data) {
                RuntimeResource.createProcess(data).$promise.then(function (process) {
                    pushNewProcess(process);
                });
            }

            function selectProcess(process) {
                $rootScope.selectedProcess = process;
            }

            function selectProcessByKey(key) {
                var process = $filter('filter')(processes, {key: key});
                if (process && process.length > 0) {
                    selectProcess(process[0]);
                    return process[0];
                }
                return undefined;
            }

            function getActiveProcesses() {
                return $filter('filter')(processes, function (value) {
                    return !(value.state === states.completed || value.state === states.aborted);
                });
            }

            function getActiveProcessesNumber() {
                if (processes) {
                    return getActiveProcesses().length;
                }
                return 0;
            }

            function hasActiveProcesses() {
                return getActiveProcessesNumber() > 0;
            }

            function getProcessesWithState(state, not) {
                if (processes) {
                    return $filter('filter')(processes, {state: (not ? '!' : '') + state});
                }
                return [];
            }

            function hasProcessesWithState(state) {
                if (processes) {
                    var i;
                    for (i = 0; i < processes.length; i++) {
                        if (processes[i].state === state) {
                            return true;
                        }
                    }
                }
                return false;
            }

            function getProcesses(date, refresh) {
                if (!date || lastProcessesRefresh < date) {
                    lastProcessesRefresh = Date.now();
                    RuntimeResource.processes().$promise.then(function (data) {
                        processes = data.entries;
                        activeProcesses = getActiveProcesses();
                        if (!refresh) {
                            subscribeToProcesses(activeProcesses);
                        }
                        if ($rootScope.selectedProcess) {
                            $rootScope.selectedProcess = $filter('filter')(processes, {key: $rootScope.selectedProcess.key})[0];
                        }
                    }, function (error) {
                        console.error('An error occurred while trying to refresh the process list', error);
                    });
                }
            }

            // *********************** //
            //          Tasks          //
            // *********************** //

            function getTasks(date) {
                if (!date || lastTasksRefresh < date) {
                    lastTasksRefresh = Date.now();
                    RuntimeResource.tasks().$promise.then(function (data) {
                        tasks = data.entries;
                    }, function (error) {
                        console.error('An error occurred while trying to refresh the task list', error);
                    });
                }
            }

            function claimTask(task) {
                RuntimeResource.claimTask({tId: task.id}, {}, function () {
                    getTasks();
                });
            }

            function completeTask(task) {
                FormResource.get({formKey: task.form}, {}, function (form) {
                    var modalScope = $rootScope.$new();
                    modalScope.formData = {};
                    modalScope.formFields = JSON.parse(form.definition);
                    modalScope.formOptions = {
                        uniqueFormId: task.form + '-' + task.id,
                        submitCopy: $translate.instant('TASKS.COMPLETE_TASK')
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
                            getTasks();
                        });
                        completeTaskModal.hide();
                    };
                    completeTaskModal = $modal({
                        title: form.name,
                        html: true,
                        scope: modalScope,
                        template: 'common/services/runtime-form-modal-template.html',
                        show: true
                    });
                });
            }

            // *********************** //
            //          Tools          //
            // *********************** //

            function refreshTools() {
                var toolJobsTemp = [], promises = [];
                angular.forEach(ToolManager.getActiveTools(), function (tool) {
                    promises.push(
                        ToolManager.getTool(tool.getKey()).getJobs().$promise.then(
                            function (data) {
                                angular.forEach(data.entries, function (job) {
                                    job.toolName = tool.getName();
                                    job.toolKey = tool.getKey();
                                });
                                toolJobsTemp = toolJobsTemp.concat(data.entries);
                            },
                            function (reason) {
                                console.warn('The server of tool "%s" is not responding', tool.getKey());
                                if (reason.status !== '401') {
                                    ToolManager.disableTool(tool.getKey());
                                }
                            }
                        )
                    );
                });

                $q.all(promises).then(
                    function () {
                        toolJobs = toolJobsTemp;
                        completedToolJobs = getToolJobsWithState(toolJobStatus.completed);
                        var justCompletedToolJobs = $filter('filter')(activeToolJobs, function (activeToolJob) {
                            return $filter('filter')(completedToolJobs, {id: activeToolJob.id}).length > 0;
                        });
                        angular.forEach(justCompletedToolJobs, function (justCompletedToolJob) {
                            $alert({title: $translate.instant('TOOLS.TOOL'), content: $translate.instant('PROCESSES.JUST_COMPLETED', {name: justCompletedToolJob.toolName}), placement: 'top-right', type: 'success', show: true});
                        });
                        activeToolJobs = getActiveToolJobs();
                        if (activeToolJobs.length === 0) {
                            $timeout.cancel(toolJobsTimeout);
                        }
                        if ($rootScope.selectedProcess && $rootScope.selectedProcess.toolName) {
                            ToolManager.getTool($rootScope.selectedProcess.toolKey).getLog($rootScope.selectedProcess.id).$promise.then(function (data) {
                                $rootScope.selectedProcess.log = data.log;
                            });
                        }
                    },
                    function () {
                        console.error('An error occurred while trying to refresh the tool list', error);
                        $timeout.cancel(toolJobsTimeout);
                    }
                );
                toolJobsTimeout = $timeout(refreshTools, timeout);
            }

            function forceRefreshToolJobs(delay) {
                if (toolJobsTimeout) {
                    $timeout.cancel(toolJobsTimeout);
                }
                if (delay) {
                    $timeout(refreshTools, delay);
                } else {
                    refreshTools();
                }
            }

            function getToolDownloadUrl(toolKey, jobId, path) {
                return ToolManager.getTool(toolKey).getDownloadUrl(jobId, path);
            }

            function getToolStates() {
                return toolJobStatus;
            }

            function selectToolJob(toolJob) {
                ToolManager.getTool(toolJob.toolKey).getLog(toolJob.id).$promise.then(function (data) {
                    $rootScope.selectedProcess.log = data.log;
                });
                $rootScope.selectedProcess = toolJob;
            }

            function getActiveToolJobs() {
                return $filter('filter')(toolJobs, function (job) {
                    return !(job.status === toolJobStatus.completed || job.status === toolJobStatus.error);
                });
            }

            function activeToolJobNumber() {
                if (toolJobs) {
                    return getActiveToolJobs().length;
                }
                return 0;
            }

            function hasActiveToolJobs() {
                return activeToolJobNumber() > 0;
            }

            function getToolJobsWithState(state, not) {
                if (toolJobs) {
                    return $filter('filter')(toolJobs, {status: (not ? '!' : '') + state});
                }
                return [];
            }

            function hasToolJobsWithState(state) {
                if (toolJobs) {
                    var i;
                    for (i = 0; i < toolJobs.length; i++) {
                        if (toolJobs[i].status === state) {
                            return true;
                        }
                    }
                }
                return false;
            }

            // *********************** //
            //          Events         //
            // *********************** //

            $rootScope.$on('process-created', function (event, process) {
                pushNewProcess(process);
            });

            $rootScope.$on('tool-job-created', function () {
                forceRefreshToolJobs();
            });

            $rootScope.$on('tool-list-registered', function () {
                refreshTools();
            });

            $rootScope.$on('runtime.process.update-state', function (event, message) {
                event.stopPropagation();
                if (message.arguments.state === states.completed) {
                    var process = $filter('filter')(activeProcesses, {key: message.fromObject});
                    if (process.length > 0) {
                        $alert({title: $translate.instant('PROCESSES.PROCESS'), content: $translate.instant('PROCESSES.JUST_COMPLETED', {name: process[0].name}), placement: 'top-right', type: 'success', show: true});
                    }
                }
                getProcesses(message.date, true);
            });

            $rootScope.$on('runtime.process.create', function (event, message) {
                event.stopPropagation();
                getProcesses(message.date, true);
            });

            $rootScope.$on('runtime.process.log', function (event, message) {
                event.stopPropagation();
                getProcesses(message.date, true);
            });

            function processTaskEvent(event, message) {
                event.stopPropagation();
                getTasks(message.date);
            }

            $rootScope.$on('runtime.task.created', function (event, message) {
                // If we receive the same message we don't process it again
                if (history['runtime.task.created'] && history['runtime.task.created'].date === message.date) {
                    return;
                }
                history['runtime.task.created'] = message;
                processTaskEvent(event, message);
                $alert({title: $translate.instant('TASKS.TASK'), content: $translate.instant('TASKS.TASK_CREATED', {name: message.fromObject}), placement: 'top-right', type: 'danger', show: true});
            });

            $rootScope.$on('runtime.task.assigned', function (event, message) {
                processTaskEvent(event, message);
            });

            $rootScope.$on('runtime.task.completed', function (event, message) {
                processTaskEvent(event, message);
            });

            // *********************** //
            //           Init          //
            // *********************** //

            function init() {
                getProcesses();
                getTasks();
                initialSubscriptions();
            }
            init();

            return {
                // Processes
                getProcesses: function () { return processes; },
                createProcessFromForm: createProcessFromForm,
                createProcess: createProcess,
                selectProcess: selectProcess,
                selectProcessByKey: selectProcessByKey,
                getActiveProcessesNumber: getActiveProcessesNumber,
                getActiveProcesses: getActiveProcesses,
                hasActiveProcesses: hasActiveProcesses,
                hasProcessesWithState: hasProcessesWithState,
                getProcessesWithState: getProcessesWithState,
                getStates: getStates,
                // Tasks
                getTasks: function () { return tasks; },
                claimTask: claimTask,
                completeTask: completeTask,
                // Tools
                getToolJobs: function () { return toolJobs; },
                selectToolJob: selectToolJob,
                activeToolJobsNumber: activeToolJobNumber,
                getActiveToolJobs: getActiveToolJobs,
                hasActiveToolJobs: hasActiveToolJobs,
                hasToolJobsWithState: hasToolJobsWithState,
                getToolJobsWithState: getToolJobsWithState,
                getToolStates: getToolStates,
                getToolDownloadUrl: getToolDownloadUrl
            };
        }]);
