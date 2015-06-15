'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolListCtrl
 * @description
 * # ToolListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', '$http', '$filter', 'MetadataFormatResource', 'Runtime', 'RuntimeResource',
        function ($scope, ToolManager, $rootScope, $translate, $http, $filter, MetadataFormatResource, Runtime, RuntimeResource) {


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

            function arrayUnique(array) {
                var a = array.concat();
                for(var i=0; i<a.length; ++i) {
                    for(var j=i+1; j<a.length; ++j) {
                        if(a[i] === a[j])
                            a.splice(j--, 1);
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
                //MetadataFormatResource.download({name:'ortolang-item-json'}).$promise.then(
                //    function(data) {
                //        var schema = angular.fromJson(data);
                //        $scope.keywords = schema.properties.toolFunctionalities.items.enum;
                //        $scope.keywords = $scope.keywords.concat(schema.properties.toolInputData.items.enum);
                //        $scope.keywords = $scope.keywords.concat(schema.properties.toolOutputData.items.enum);
                //    },
                //    function(reason) {
                //        console.error('Cant get schema of metadata formats "ortolang-item-json" ; failed cause ' + reason + ' !');
                //    }
                //);
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

            $scope.hasToolConfig = function () {
                return $scope.config.model !== undefined;
            };


            function onSubmit () {
                $scope.config.model.toolKey = $scope.selectedTool.getKey();
                ToolManager.getTool($scope.selectedTool.getKey()).createJob($scope.config.model).$promise.then(
                    function () {
                        $scope.hide();
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
            }

            $scope.onSubmit = onSubmit;
            init();
        }]);
