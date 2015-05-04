'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolListCtrl
 * @description
 * # ToolListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', '$http', '$filter', 'MetadataFormatResource',
        function ($scope, ToolManager, $rootScope, $translate, $http, $filter, MetadataFormatResource) {


            // ***************** //
            // Editor visibility //
            // ***************** //

            $scope.visibility = false;

            $scope.show = function () {
                $scope.visibility = true;
            };

            $scope.hide = function () {
                $scope.visibility = false;
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
            };

            $scope.hasToolSelected = function () {
                return $scope.selectedTool !== undefined;
            };

            $scope.getSize = function (obj) {
                var size = 0;
                for(var k in obj){
                    size++;
                }
                return size;
            };

            function loadToolsList () {
                $scope.tools = ToolManager.getRegistry();
                $scope.filteredTools = $scope.tools;

                MetadataFormatResource.download({name:'ortolang-item-json'}).$promise.then(
                    function(data) {
                        var schema = angular.fromJson(data);
                        $scope.keywords = schema.properties.toolFunctionality.items.enum;
                        $scope.keywords = $scope.keywords.concat(schema.properties.toolInputData.items.enum);
                    },
                    function(reason) {
                        console.error('Cant get schema of metadata formats "ortolang-item-json" ; failed cause ' + reason + ' !');
                    }
                );
            }

            function loadConfig() {

                $scope.config.loadingData = ToolManager.getTool($scope.selectedTool.getKey()).getExecutionForm().$promise.then(
                    function (result) {
                        $scope.config.model = {};
                        $scope.config.formFields = result;
                        $scope.config.originalFields = angular.copy($scope.config.formFields);
                    },
                    function (msg) {
                        console.error('The tool server for "%s" is not responding.', $scope.selectedTool.getName(), msg);
                        $scope.config.model = undefined;
                    }
                );
            }

            $scope.hasToolConfig = function () {
                return $scope.config.model !== undefined;
            };


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
                                toolNoAccent = toolNoAccent + tool.name.toLowerCase();
                                toolNoAccent = toolNoAccent.replace(new RegExp('\\s', 'g'), '-');
                                if(toolNoAccent.search(term.toLowerCase()) !== -1) {
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

            function onSubmit () {
                ToolManager.getTool($scope.selectedTool.getKey()).createJob($scope.model).$promise.then(
                    function () {
                        $rootScope.$broadcast('tool-job-created');
                        $scope.hide();
                    },
                    function (msg) {
                        console.error('An error happens while trying to run "%s".', $scope.selectedTool.getName(), msg);
                        $scope.showError(msg);
                    }
                );
            }

            function init() {
                $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
                $scope.tools = {};
                $scope.searchContent = '';
                $scope.config = {};
                loadToolsList();
                $scope.selectedTool = undefined;
            }

            $scope.onSubmit = onSubmit;
            init();
        }]);
