'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolListCtrl
 * @description
 * # ToolListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolListCtrl', ['$scope', 'ToolManager', '$rootScope', '$translate', '$http', '$filter',
        function ($scope, ToolManager, $rootScope, $translate, $http, $filter) {

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
            ToolManager.checkGrant(tool.getKey()).then(function () {
                $scope.loadConfig();
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

        $scope.loadToolsList = function () {
            $scope.tools = ToolManager.getRegistry();
            $scope.filteredTools = $scope.tools;
            //console.log($scope.filteredTools);

            //test
            $scope.subcategoriesColors = {'misc': '#F0AD4E', 'segmentation': '#5BC0DE', 'étiquetage': '#5CB85C', 'analyse': '#D9534F'};
            //$http.get('common/tools/data-test.json')
            //    .then(function(res){
            //        $scope.tools = res.data;
            //        $scope.filteredTools = res.data;
            //    });

        };

        $scope.loadConfig = function () {
            ToolManager.getTool($scope.selectedTool.getKey()).getExecutionForm().$promise.then(
                function (config) {
                    $scope.generateForm(config);
                },
                function (msg) {
                    console.error('The tool server for "%s" is not responding.', $scope.selectedTool.getName(), msg);
                    $scope.formData = undefined;
                }
            );
        };

        $scope.hasToolConfig = function () {
            return $scope.formData !== undefined;
        };

        $scope.generateForm = function (configJSON) {
            $scope.formData = {};
            $scope.formFields = configJSON;
            $scope.formOptions = {
                hideSubmit: false,
                submitCopy: $translate.instant('TOOLS.RUN_TOOL')
            };
            $scope.formOptionsCopy = angular.copy($scope.formOptions);
        };

        // Tool List search/filter

        $scope.search = function (data) {
            var filtered = [];
            if (data !== '' && data !== undefined) {
                var searchTerms = data.split(' ');
                searchTerms.forEach(function(term) {
                    if (term && term.length) {
                        term = $filter('removeAccents')(term);
                        //var tmpFiltered = $filter('filter')($scope.tools, term);
                        var tmpFiltered = $filter('filter')($scope.tools, function (tool) {
                            var toolNoAccent =  $filter('removeAccents')(JSON.stringify(tool).toLowerCase());
                            if(toolNoAccent.search(term.toLowerCase()) !== -1) {
                                return tool;
                            }
                        });
                        filtered = filtered.concat(tmpFiltered);
                    }
                });
            } else {
                filtered = $scope.tools;
            }
            $scope.filteredTools = filtered;
        };


        $scope.filter = function (filterID, filterValue, filterTranslation) {
            if (filterID && filterValue) {
                if (filterID === 'content') {
                    var registry = ToolManager.toArray($scope.tools);
                    $scope.filteredTools = $filter('filter')(registry, { 'content' : filterValue});
                    $scope.selectedType = filterValue;
                    $scope.selectedTypeTranslation = filterTranslation;
                } else {
                    $scope.filteredTools = $filter('filter')($scope.tools, {'meta': {filterID: filterValue}});
                }
            }
        };


        $scope.resetFilter = function () {
            $scope.filteredTools = angular.copy($scope.tools);
            $scope.selectedType = '';
            $scope.searchContent = '';
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

        $scope.onSubmit = function () {
            ToolManager.getTool($scope.selectedTool.getKey()).createJob($scope.formData).$promise.then(
                function () {
                    $rootScope.$broadcast('tool-job-created');
                    $scope.hide();
                },
                function (msg) {
                    console.error('An error happens while trying to run "%s".', $scope.selectedTool.getName(), msg);
                    $scope.showError(msg);
                }
            );
        };

        function init() {
            $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
            $scope.tools = {};
            $scope.searchContent = '';
            $scope.loadToolsList();
            $scope.selectedTool = undefined;
        }

        init();
    }]);
