'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$scope', '$modal', '$routeParams', 'Runtime', 'ToolManager', '$alert', '$rootScope', '$filter', 'ProcessesFiltersManager', 'moment',
        function ($scope, $modal, $routeParams, Runtime, ToolManager, $alert, $rootScope, $filter, ProcessesFiltersManager, moment) {
            var name;

            /****************/
            /* SHOW ACTIONS */
            /****************/

            $scope.showLog = function (process, processKey) {
                if (processKey) {
                    process = Runtime.selectProcessByKey(processKey);
                } else if (process.hasOwnProperty('processTool')) {
                    Runtime.selectRemoteProcess(process);
                    name = process.processTool.name;
                } else {
                    Runtime.selectProcess(process);
                    name = process.name;
                }
                if (process) {
                    $scope.maxProcessLogHeight = (window.innerHeight - 220) + 'px';
                    $scope.failed = (process.state === Runtime.getStates().aborted) || (process.state === Runtime.getStates().suspended);
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
                ToolManager.getTool(process.toolKey).getForm().then(function (result) {
                        $scope.config = result[1];
                        $modal({
                            title: process.processTool.name,
                            html: true,
                            scope: $scope,
                            template: 'common/tools/tool-tpl-parameters.html',
                            show: true
                        });
                    },
                    function (msg) {
                        console.error('The tool server for "%s" is not responding.', tool.getName(), msg);
                    }
                );
            };

            $scope.showResult = function (process) {
                Runtime.selectRemoteProcess(process);
                ToolManager.getTool(process.toolKey).getResult(process.jobId).$promise.then(function (data) {
                    $scope.results = data;
                    $scope.job = process.job;
                    $scope.tool = ToolManager.getTool(process.toolKey);
                    $scope.switchStatus = [];
                    $scope.maxProcessLogHeight = (window.innerHeight - 170) + 'px';
                    $scope.failed = (process.state === Runtime.getStates().aborted) || (process.state === Runtime.getStates().suspended);
                    $scope.log = process.log;
                    $rootScope.$broadcast('tool-results-show');
                });
            };

            $scope.showAll = function () {
                $scope.processus.processesDisplayed = $scope.processus.processesDisplayed + 10;
            };

            $scope.getToolDownloadUrl = function (url, jobid, path) {
                return url + '/jobs/' + jobid + '/download?path=' + path;
            };


            //$scope.test = function () {
            //    Runtime.createProcess({
            //        'process-type': 'test',
            //        'process-name': 'Test process',
            //        'name': 'John'
            //    });
            //};


            /*********************/
            /* TODAY'S PROCESSES */
            /*********************/

            $scope.getLastProcesses = function () {
                var processes = $filter('filter')(Runtime.getEveryProcessesWithState(Runtime.getHistoryStates()), function (process) {
                    if((moment().diff(moment(process.start), 'days') < 1) ) {
                        return process;
                    }
                });
                var activeProcesses = $scope.unique(Runtime.getEveryActiveProcesses());
                return processes.concat(activeProcesses);
            };

            $scope.getOrderedLastProcesses = function () {
                return $scope.orderedProcesses($scope.getLastProcesses(), $scope.processus.orderProp1, $scope.processus.orderReverse1);
            };

            /************************************/
            /* PROCESSES HISTORY FACETED SEARCH */
            /************************************/

            $scope.getProcessesHistory = function () {
                return Runtime.getEveryProcessesWithState(Runtime.getHistoryStates());
            };

            $scope.filteredOrderedProcesses = function (processes) {
                $scope.processus.processesHistory = ProcessesFiltersManager.filter($scope.unique(processes));
                $scope.search();
                return $scope.orderedProcesses($scope.processus.processesHistory, $scope.processus.orderProp2, $scope.processus.orderReverse2);
            };

            $scope.search = function () {
                var filtered = $scope.processus.processesHistory;
                if ($scope.processus.search !== undefined && $scope.processus.search.length) {
                    $scope.processus.search.forEach(function (term) {
                        if (term.length) {
                            term = $filter('removeAccents')(term);
                            filtered = $filter('filter')(filtered, function (process) {
                                var noAccent = $filter('removeAccents')(JSON.stringify(process).toLowerCase());
                                noAccent = noAccent.replace(new RegExp('\\s', 'g'), '-');
                                if (noAccent.search(term.toLowerCase()) !== -1) {
                                    return process;
                                }
                            });
                        }
                    });
                }
                $scope.processus.processesHistory = filtered;
            };

            $scope.switchFilter = function (filter, value) {
                ProcessesFiltersManager.switchFilter(filter, value);
            };


            $scope.toggleFilter = function (filter, value) {
                ProcessesFiltersManager.toggleFilter(filter, value);
            };

            $scope.removeFilter = function (filter) {
                ProcessesFiltersManager.removeFilter(filter);
            };

            $scope.orderLatest = function (predicate, reverse) {
                $scope.processus.orderReverse1 = reverse === 'toggle' ? !$scope.processus.orderReverse1 : reverse;
                $scope.processus.orderProp1 = predicate;
            };

            $scope.orderHistory = function (predicate, reverse) {
                $scope.processus.orderReverse2 = reverse === 'toggle' ? !$scope.processus.orderReverse2 : reverse;
                $scope.processus.orderProp2 = predicate;
            };

            $scope.unique = function (processes) {
                return $filter ('filter')(processes, function(item, pos, self) {
                    return self.indexOf(item) === pos;
                });
            };

            $scope.orderedProcesses = function(processes, orderProp, orderReverse) {
                return $filter('orderBy')(processes, orderProp, orderReverse);
            };

            /************/
            /* WATCHERS */
            /************/

            $scope.$watch(function () {
                return {
                    processesHistory: $scope.processus.processesHistory
                };
            }, function (newValue) {
                $scope.count = function (prop, value) {
                    return function (el) {
                        return el[prop] === value;
                    };
                };
                $scope.countDate = function (prop, value) {
                    return function (el) {
                        return moment().diff(moment(el[prop]), value)<=1;
                    };
                };

                $scope.processus.processesNumber = newValue.processesHistory.length;

            }, true);

            $scope.$watch(function () {
                return {
                    lastProcesses: Runtime.getEveryActiveProcesses()
                };
            }, function () {
                init();

            }, true);


            $scope.$watch(function () {
                return {
                    typesList: Runtime.getTypes()
                };
            }, function () {
                initFilterType();

            }, true);


            /********/
            /* INIT */
            /********/

            function initFilterState() {
                $scope.optionsState = {};
                angular.forEach(Runtime.getHistoryStates(), function (state){
                    ProcessesFiltersManager.addFilter('state', state);
                    $scope.optionsState[state] = true;
                });
            }

            function initFilterType() {
                $scope.optionsType = {};
                angular.forEach(Runtime.getTypes(), function (type){
                    ProcessesFiltersManager.addFilter('type', type);
                    $scope.optionsType[type] = true;
                });
            }

            function init() {
                $scope.Runtime = Runtime;

                $scope.processus = {};
                $scope.processus.lastProcesses = $scope.getLastProcesses();
                $scope.processus.processesHistory = Runtime.getEveryProcessesWithState(Runtime.getHistoryStates());
                $scope.processus.processesNumber = $scope.processus.processesHistory.length;
                $scope.processus.search = '';

                $scope.processus.completedProcessessDisplayed = 3;
                $scope.processus.abortedProcessessDisplayed = 3;
                //$scope.processus.lastProcessesDisplayed = 10;
                $scope.processus.processesDisplayed = 10;

                // Filter set by default to start date in descending order
                $scope.processus.orderProp1 = 'start';
                $scope.processus.orderReverse1 = true;
                $scope.processus.orderProp2 = 'stop';
                $scope.processus.orderReverse2 = true;

                $scope.activeTab = 0;
                $scope.facets = false;

                initFilterState();
                initFilterType();

                if ($routeParams.pKey) {
                    $scope.showLog(undefined, $routeParams.pKey);
                }

            }

            init();
        }
    ]
);
