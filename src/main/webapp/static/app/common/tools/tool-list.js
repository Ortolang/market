'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolListCtrl
 * @description
 * # ToolListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', '$http', '$filter', 'Runtime', '$alert', 'Settings',
        function ($scope, ToolManager, $rootScope, $translate, $http, $filter, Runtime, $alert, Settings) {


            // ***************** //
            // Editor visibility //
            // ***************** //

            $scope.visibility = false;

            $scope.show = function () {
                $scope.visibility = true;
            };

            $scope.hide = function () {
                $scope.visibility = false;
                $scope.currentJob = undefined;
            };

            $scope.toggle = function () {
                if ($scope.visibility) {
                    $scope.hide();
                } else {
                    $scope.show();
                }
            };

            $scope.isVisible = function () {
                return $scope.visibility;
            };

            // Tools list //

            $scope.selectTool = function (tool) {
                $scope.selectedTool = tool;
                $scope.config = {};
                ToolManager.checkGrant(tool.getKey()).then(function () {
                    loadConfig();
                });
            };

            $scope.resetSelectedTool = function () {
                $scope.selectedTool = undefined;
                $scope.config.model = undefined;
                $scope.currentJob = undefined;
            };

            $scope.hasToolSelected = function () {
                return $scope.selectedTool !== undefined;
            };

            $scope.hasToolConfig = function () {
                return $scope.config.model !== undefined;
            };

            $scope.isRunning = function () {
                return $scope.currentJob !== undefined;
            };

            $scope.getSize = function (obj) {
                var size = 0;
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        size++;
                    }
                }
                return size;
            };

            function arrayUnique(array) {
                var a = array.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i+1; j < a.length; ++j) {
                        if (a[i] === a[j]) {
                            a.splice(j--, 1);
                        }
                    }
                }

                return a;
            }

            function loadToolsList () {
                $scope.tools = ToolManager.getRegistry();
                $scope.filteredTools = $scope.tools;

                $scope.keywords = ToolManager.getFunctionalities();
                $scope.keywords = arrayUnique($scope.keywords.concat(ToolManager.getInputData()));
                $scope.keywords = arrayUnique($scope.keywords.concat(ToolManager.getOutputData()));
            }

            function loadConfig() {

                $scope.config.loadingData = ToolManager.getTool($scope.selectedTool.getKey()).getForm().then(
                    function (result) {
                        $scope.config.model = result[0];
                        $scope.config.formFields = result[1];
                        $scope.config.originalFields = angular.copy($scope.config.formFields);
                    },
                    function (msg) {
                        console.error('The tool server for "%s" is not responding.', $scope.selectedTool.getName(), msg);
                        $scope.config.model = undefined;
                    }
                );
            }

            function onSubmit () {
                $scope.config.model.toolKey = $scope.selectedTool.getKey();
                $scope.currentJob = {};
                $scope.currentJob.state = $translate.instant('PROCESSES.'+ Runtime.getStates().submitted);
                $scope.currentJob.completedStates = [];
                ToolManager.getTool($scope.selectedTool.getKey()).createJob($scope.config.model).$promise.then(
                    function (job) {
                        console.debug(job);
                        $scope.currentJob.job = job;
                        $scope.currentJob.completedStates.push($scope.currentJob.state);
                        $scope.currentJob.state = $translate.instant('PROCESSES.' + job.status);
                        $scope.currentJob.completed = false;
                        $rootScope.$broadcast('remote-process-created', job);
                    },
                    function (msg) {
                        console.error('An error happens while trying to run "%s".', $scope.selectedTool.getName(), msg);
                        $scope.showError(msg);
                    }
                );
            }


            // Tool List search/filter

            $scope.addTag = function (tag, tagList) {
                tagList.push({text:tag.replace(new RegExp('\\s', 'g'), '-')});
                $scope.search(tagList);
            };

            $scope.loadToolTags = function(query) {
                return $filter('filter')($scope.keywords, query);
            };

            $scope.search = function (data) {
                var filtered = ToolManager.toArray($scope.tools);
                if (data !== undefined && data.length) {
                    data.forEach(function(term) {
                        if (term.text && term.text.length) {
                            term = $filter('removeAccents')(term.text);
                            filtered = $filter('filter')(filtered, function (tool) {
                                var toolNoAccent =  $filter('removeAccents')(JSON.stringify(tool.functionalities).toLowerCase());
                                toolNoAccent = toolNoAccent + $filter('removeAccents')(JSON.stringify(tool.inputData).toLowerCase());
                                //search in names too
                                toolNoAccent = toolNoAccent + $scope.getTitleValue(tool.name);
                                toolNoAccent = toolNoAccent.replace(new RegExp('\\s', 'g'), '-');
                                if(toolNoAccent.toLowerCase().search(term.toLowerCase()) !== -1) {
                                    return tool;
                                }
                            });
                        }
                    });
                }
                $scope.filteredTools = filtered;
            };

            $scope.resetFilter = function () {
                $scope.filteredTools = angular.copy($scope.tools);
                $scope.selectedType = '';
                $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
            };

            /** Tool execution **/

            $scope.abortToolJob = function () {
                ToolManager.getTool($scope.currentJob.job.toolKey).abortJob($scope.currentJob.job.id).$promise.then(
                    function () {
                        $alert({title: $scope.getTitleValue(ToolManager.getTool($scope.currentJob.job.toolKey).name), content: 'annulé', type: 'success'});
                    },
                    function () {
                        $alert({title: $scope.getTitleValue(ToolManager.getTool($scope.currentJob.job.toolKey).name), content: 'pas annulé', type: 'danger'});
                    }
                );
            };


            $scope.showResult = function () {
                ToolManager.getTool($scope.currentJob.job.toolKey).getResult($scope.currentJob.job.id).$promise.then(function (data) {
                    $scope.results = data;
                    $scope.job = $scope.currentJob.job;
                    $scope.tool = ToolManager.getTool($scope.currentJob.job.toolKey);
                    $scope.switchStatus = [];
                    $scope.maxProcessLogHeight = (window.innerHeight - 170) + 'px';
                    $scope.log = $scope.currentJob.log;
                    $scope.failed = $scope.currentJob.error;
                    $rootScope.$broadcast('tool-results-show');
                });
            };


            // ***************** //
            // Alert visibility //
            // ***************** //

            $scope.fail = false;
            $scope.failMsg = undefined;

            $scope.showError = function (msg) {
                $scope.fail = true;
                $scope.failMsg = msg;
            };

            $scope.hideError = function () {
                $scope.fail = false;
            };

            $scope.isShowError = function () {
                return $scope.fail;
            };


            // ********* //
            // Listeners //
            // ********* //

            $scope.$on('tool-list-show', function () {
                $scope.resetSelectedTool();
                $scope.show();
            });

            $rootScope.$on('runtime.remote.log', function (event, message) {
                event.stopPropagation();
                if($scope.currentJob !== undefined && message.fromObject === $scope.currentJob.job.processId) {
                    var myJSONString = JSON.stringify(message.arguments.message);
                    $scope.currentJob.log = myJSONString.replace(/\\n/g, '\n')
                        .replace(/\\"/g, '')
                        .replace(/\"/g, '')
                        .replace(/\\r/g, '\r')
                        .replace(/\\t/g, '\t');
                }
            });

            $rootScope.$on('runtime.remote.update-state', function (event, message) {
                event.stopPropagation();
                if($scope.currentJob !== undefined && message.fromObject === $scope.currentJob.job.processId) {
                    $scope.currentJob.completedStates.push($scope.currentJob.state);
                    $scope.currentJob.state = $translate.instant('PROCESSES.' + message.arguments.state);
                    if(message.arguments.state === Runtime.getStates().completed) {
                        $scope.currentJob.completed = true;
                        $scope.currentJob.error = false;
                    }
                    if((message.arguments.state === Runtime.getStates().suspended) || (message.arguments.state === Runtime.getStates().aborted)) {
                        $scope.currentJob.completed = true;
                        $scope.currentJob.error = true;
                    }
                }
            });

            $scope.getTitleValue = function (multilingualTitle) {
                if (!multilingualTitle) {
                    return null;
                }
                var i;
                for (i = 0; i < multilingualTitle.length; i++) {
                    if (multilingualTitle[i].lang === Settings.language) {
                        return multilingualTitle[i].value;
                    }
                }
                return multilingualTitle.length > 0 ? multilingualTitle[0].value : undefined;
            };


            // ************** //
            // Initialization //
            // ************** //

            function init() {
                $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
                $scope.tools = {};
                $scope.searchContent = '';
                $scope.config = {};
                loadToolsList();
                $scope.selectedTool = undefined;
                $scope.currentJob = undefined;
            }

            $scope.onSubmit = onSubmit;
            init();
        }]);
