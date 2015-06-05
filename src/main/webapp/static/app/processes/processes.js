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
            var name;

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

            $scope.showAll = function ($event) {
                $($event.target).addClass('hidden').prev('table').addClass('show-all');
            };

            $scope.getToolDownloadUrl = function (url, jobid, path) {
                return url + '/jobs/' + jobid + '/download?path=' + path;
            };

            $scope.getProcessesHistory = function () {
                return Runtime.getEveryProcessesWithState([Runtime.getStates().completed, Runtime.getStates().aborted, Runtime.getStates().suspended]);
            };

            $scope.filteredOrderedProcesses = function (processes) {
                $scope.processus.processesHistory = processes;
                console.debug('filtre',$scope.processus.filters);
                $scope.filter();
                $scope.search();
                return $filter('orderBy')($scope.processus.processesHistory, $scope.processus.orderProp, $scope.processus.orderReverse);
            };

            $scope.order = function (predicate, reverse) {
                $scope.processus.orderReverse = reverse === 'toggle' ? !$scope.processus.orderReverse : reverse;
                $scope.processus.orderProp = predicate;
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

            $scope.filterCount = function (field, value) {
                var filtered = Runtime.getEveryProcessesWithState([Runtime.getStates().completed, Runtime.getStates().aborted, Runtime.getStates().suspended]);
                if(value === 'ALL') {
                    return filtered.length;
                }
                filtered = $filter('filter')(filtered, function (process) {
                    if (process[field] !== undefined && process[field].toLowerCase() === value.toLowerCase()) {
                        return process;
                    }
                });
                return filtered.length;
            };

            $scope.filter = function() {
                var filtered = $scope.processus.processesHistory;
                angular.forEach($scope.processus.filters, function(field, value) {
                    filtered = $filter('filter')(filtered, function (process) {
                        if (process[field] !== undefined && process[field].toLowerCase() === value.toLowerCase()) {
                            return process;
                        }
                    });
                });
                $scope.processus.processesHistory = filtered;
            };

            $scope.switchFilter = function (filter, value) {
                angular.forEach($scope.processus.filters, function(field, value) {
                    if (field === filter) {
                        $scope.processus.filters[field] = value;
                    }
                });
                $scope.processus.filters[filter]=value;
                console.debug('add', $scope.processus.filters);
            };

            $scope.removeFilter = function (filter) {
                delete $scope.processus.filters[filter];
                console.debug('delete', $scope.processus.filters);
            };

            //
            //$scope.switchFacets = function () {
            //    $scope.facets = !$scope.facets;
            //};


            //$scope.test = function () {
            //    Runtime.createProcess({
            //        'process-type': 'test',
            //        'process-name': 'Test process',
            //        'name': 'John'
            //    });
            //};

            //var uniqueItems = function (data, key) {
            //    var result = [];
            //
            //    for (var i = 0; i < data.length; i++) {
            //        var value = data[i][key];
            //
            //        if (result.indexOf(value) == -1) {
            //            result.push(value);
            //        }
            //
            //    }
            //    return result;
            //};

            function init() {
                $scope.Runtime = Runtime;

                $scope.processus = {};
                $scope.processus.processesHistory = Runtime.getEveryProcessesWithState([Runtime.getStates().completed, Runtime.getStates().aborted, Runtime.getStates().suspended]);
                $scope.processus.search = '';
                $scope.processus.filters = {};

                $scope.processus.completedProcessessDisplayed = 3;
                $scope.processus.abortedProcessessDisplayed = 3;
                $scope.processus.processessDisplayed = 10;

                // Filter set by default to start date in descending order
                $scope.processus.orderProp = 'stop';
                $scope.processus.orderReverse = true;

                $scope.activeTab = 0;
                $scope.facets = false;


                $scope.statusList = Runtime.getStates();


                if ($routeParams.pKey) {
                    $scope.showLog(undefined, $routeParams.pKey);
                }
            }

            init();
        }
    ]
);
