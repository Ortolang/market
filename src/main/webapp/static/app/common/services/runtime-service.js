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
        function ($rootScope, $filter, $timeout, $modal, $alert, $translate, AuthService, FormResource, RuntimeResource, AtmosphereService, ToolManager, User) {

            var processes = [],
                tasks = [],
                remoteProcesses = [],
                processModal,
                completeTaskModal,
                states = {
                    pending: 'PENDING',
                    submitted: 'SUBMITTED',
                    running: 'RUNNING',
                    suspended: 'SUSPENDED',
                    aborted: 'ABORTED',
                    completed: 'COMPLETED'
                },
                lastTasksRefresh,
                lastProcessesRefresh,
                activeProcesses = [],
                activeRemoteProcesses = [],
                history = {};


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

            function subscribeToRemoteProcess(jobsToSubscribeTo) {
                if (!angular.isArray(jobsToSubscribeTo)) {
                    jobsToSubscribeTo = [jobsToSubscribeTo];
                }
                angular.forEach(jobsToSubscribeTo, function (job) {
                    //console.debug(job, job.processId);
                    AtmosphereService.addFilter({typePattern: 'runtime\\.remote\\..*', fromPattern: job.processId});
                });
            }

            function initialSubscriptions() {
                AuthService.sessionInitialized().then(function () {
                    AtmosphereService.addFilter({typePattern: 'runtime\\.process\\.create', throwedByPattern: User.key});
                    angular.forEach(User.groups, function (group) {
                        AtmosphereService.addFilter({typePattern: 'runtime\\.task\\..*', argumentsPatterns: {group: group}});
                    });
                    AtmosphereService.addFilter({typePattern: 'runtime\\.task\\..*', argumentsPatterns: {user: User.key}});
                    AtmosphereService.addFilter({typePattern: 'runtime\\.remote\\.create', throwedByPattern: User.key});
                    AtmosphereService.addFilter({typePattern: 'membership\\.group\\.add-member', argumentsPatterns: {member: User.key}});
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
                    modalScope.submitText = $translate.instant('PROCESSES.START_PROCESS');
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
                    modalScope.submitText = $translate.instant('TASKS.COMPLETE_TASK');
                    modalScope.onSubmit = function () {
                        var variables = [], type;
                        angular.forEach(modalScope.formData, function (value, key) {
                            if (value === true || value === false) {
                                type = 'boolean';
                            } else if (angular.isString(value)) {
                                type = 'string';
                            }
                            variables.push({name: key, value: value, type: type});
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


            //function pushNewRemoteProcess(job) {
            //    remoteProcesses.push(job);
            //    subscribeToRemoteProcess(job);
            //    console.debug('suscribed ! (1)');
            //    if (job.state !== states.completed && job.state !== states.aborted && job.state !== states.suspended) {
            //        activeRemoteProcesses.push(job);
            //    }
            //}

            function getActiveRemoteProcesses() {
                return $filter('filter')(remoteProcesses, function (value) {
                    return !(value.state === states.completed || value.state === states.aborted || value.state === states.suspended);
                });
            }

            function selectRemoteProcess(remoteProcess) {
                $rootScope.selectedProcess = remoteProcess;
            }

            function selectRemoteProcessByKey(key) {
                var remoteProcess = $filter('filter')(remoteProcesses, {key: key});
                if (remoteProcess && remoteProcess.length > 0) {
                    selectProcess(remoteProcess[0]);
                    return remoteProcess[0];
                }
                return undefined;
            }

            function getActiveRemoteProcessesNumber() {
                if (remoteProcesses) {
                    return getActiveRemoteProcesses().length;
                }
                return 0;
            }

            function hasActiveRemoteProcesses() {
                return getActiveRemoteProcessesNumber() > 0;
            }

            function getRemoteProcessesWithState(state, not) {
                if (remoteProcesses) {
                    return $filter('filter')(remoteProcesses, {state: (not ? '!' : '') + state});
                }
                return [];
            }

            function hasRemoteProcessesWithState(state) {
                if (remoteProcesses) {
                    var i;
                    for (i = 0; i < remoteProcesses.length; i++) {
                        if (remoteProcesses[i].state === state) {
                            return true;
                        }
                    }
                }
                return false;
            }

            function getRemoteProcesses(date, refresh) {
                if (!date || lastProcessesRefresh < date) {
                    remoteProcesses = [];
                    var keys = [];
                    lastProcessesRefresh = Date.now();
                    RuntimeResource.remoteProcesses().$promise.then(function (data) {
                        angular.forEach( data.entries, function (process) {
                            var remoteProcess = process;
                            remoteProcess.type = 'tool';
                            if(ToolManager.isRegistryLoaded()) {
                                remoteProcess.processTool = ToolManager.getTool(process.toolKey);
                                remoteProcess.job = ToolManager.getTool(process.toolKey).getJob(process.jobId);
                                if (keys.indexOf(remoteProcess.key) === -1) {
                                    keys.push(remoteProcess.key);
                                    remoteProcesses.push(remoteProcess);
                                }
                            }
                        });
                        console.debug(remoteProcesses);
                        activeRemoteProcesses = getActiveRemoteProcesses();
                        if (!refresh) {
                            subscribeToRemoteProcess(activeRemoteProcesses);
                        }
                        if ($rootScope.selectedProcess) {
                            $rootScope.selectedProcess = $filter('filter')(activeRemoteProcesses, {key: $rootScope.selectedProcess.key})[0];
                        }
                    }, function (error) {
                        console.error('An error occurred while trying to refresh the remote process list', error);
                    });
                }
            }

            // *********************** //
            //          Misc           //
            // *********************** //

            function getEveryProcesses() {
                return getActiveProcesses().concat(getActiveRemoteProcesses());
            }

            function getEveryProcessesWithState(state, not) {
                if(angular.isArray(state)){
                    var processes = [];
                    angular.forEach(state, function (status) {
                        processes = processes.concat(getProcessesWithState(status, not));
                        processes = processes.concat(getRemoteProcessesWithState(status, not));
                    });
                    return processes;
                } else {
                    return getProcessesWithState(state, not).concat(getRemoteProcessesWithState(state, not));
                }
            }


            function hasEveryProcessesWithState(state) {
                if(angular.isArray(state)){
                    var hasProcesses = false;
                    angular.forEach(state, function (status) {
                        hasProcesses = hasProcesses || hasProcessesWithState(status);
                        hasProcesses = hasProcesses || hasRemoteProcessesWithState(status);
                    });
                    return hasProcesses;
                } else {
                    return hasProcessesWithState(state) || hasRemoteProcessesWithState(state);
                }
            }

            function hasEveryActiveProcesses() {
                return hasActiveProcesses() || hasActiveRemoteProcesses();
            }

            function getEveryActiveProcesses() {
                return getActiveProcesses().concat(getActiveRemoteProcesses());
            }

            function getEveryActiveProcessesNumber() {
                return getActiveProcessesNumber() + getActiveRemoteProcessesNumber();
            }

            function getEveryProcessesNumberWithState(state, not) {
                if(angular.isArray(state)){
                    var n = 0;
                    angular.forEach(state, function (status) {
                        n = n + getProcessesWithState(status, not).length + getRemoteProcessesWithState(status, not).length;
                    });
                    return processes;
                } else {
                    return getProcessesWithState(state, not).length + getRemoteProcessesWithState(state, not).length;
                }
            }

            // *********************** //
            //          Events         //
            // *********************** //

            $rootScope.$on('process-created', function (event, process) {
                pushNewProcess(process);
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
                getProcesses(message.date, false);
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

            $rootScope.$on('tool-list-registered', function () {
                AuthService.sessionInitialized().then(function () {
                    if (AuthService.isAuthenticated()) {
                        getRemoteProcesses();
                    }
                });
            });

            $rootScope.$on('remote-process-created', function (event, process) {
                subscribeToRemoteProcess(process);
                console.debug(process);
            });

            $rootScope.$on('runtime.remote.update-state', function (event, message) {
                event.stopPropagation();
                if (message.arguments.state === states.completed) {
                    var remoteProcess = $filter('filter')(activeRemoteProcesses, {key: message.fromObject});
                    if (remoteProcess.length > 0) {
                        $alert({title: $translate.instant('PROCESSES.PROCESS'), content: $translate.instant('PROCESSES.JUST_COMPLETED', {name: remoteProcess[0].name}), placement: 'top-right', type: 'success', show: true});
                    }
                }
                getRemoteProcesses(message.date, true);
            });

            $rootScope.$on('runtime.remote.create', function (event, message) {
                event.stopPropagation();
                getRemoteProcesses(message.date, true);
            });

            $rootScope.$on('runtime.remote.log', function (event, message) {
                event.stopPropagation();
                getRemoteProcesses(message.date, true);
            });

            // *********************** //
            //           Init          //
            // *********************** //

            function init() {
                AuthService.sessionInitialized().then(function () {
                    if (AuthService.isAuthenticated()) {
                        getProcesses();
                        getTasks();
                        initialSubscriptions();
                    }
                });
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
                getRemoteProcesses: function () { return remoteProcesses; },
                selectRemoteProcess: selectRemoteProcess,
                selectRemoteProcessByKey: selectRemoteProcessByKey,
                getActiveRemoteProcessesNumber: getActiveRemoteProcessesNumber,
                getActiveRemoteProcesses: getActiveRemoteProcesses,
                hasActiveRemoteProcesses: hasActiveRemoteProcesses,
                hasRemoteProcessesWithState: hasRemoteProcessesWithState,
                getRemoteProcessesWithState: getRemoteProcessesWithState,
                //pushNewRemoteProcess: pushNewRemoteProcess,
                // Misc
                getEveryProcesses: getEveryProcesses,
                getEveryProcessesWithState: getEveryProcessesWithState,
                getEveryActiveProcessesNumber: getEveryActiveProcessesNumber,
                hasEveryProcessesWithState: hasEveryProcessesWithState,
                getEveryProcessesNumberWithState: getEveryProcessesNumberWithState,
                getEveryActiveProcesses: getEveryActiveProcesses,
                hasEveryActiveProcesses: hasEveryActiveProcesses
            };
        }]);
