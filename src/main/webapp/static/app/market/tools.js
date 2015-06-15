'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Tools
 * @description
 * # Tools
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'ItemManager', function ($scope, icons, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, ItemManager) {

        function initScopeVariables() {
    		$scope.query = '';
    		$scope.items = ItemManager.make();

        	$scope.filtersManager = FacetedFilterManager.make();

            $scope.typeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.type', 
                alias: 'type',
                label: 'MARKET.RESOURCE_TYPE',  
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Corpus', 
                        value: 'Corpus',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Lexique', 
                        value: 'Lexique',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Outil', 
                        value: 'Outil',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Projet intégré', 
                        value: 'Application',
                        length: 1
                    })
                ],
                lockOptions: true,
                lock: true
            });
            $scope.filtersManager.addAvailabledFilter($scope.typeFilter);

            var languageFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolLanguages',
                alias: 'toolLanguages',
                type: 'array',
                label: 'MARKET.FACET.TOOL_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter(languageFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUSOFUSE',
                resetLabel: 'MARKET.FACET.ALL_STATUSOFUSE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter(statusOfUseFilter);

            var toolFunctionalitiesFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolFunctionalities',
                alias: 'toolFunctionalities',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FUNCTIONALITY'
            });
            $scope.filtersManager.addAvailabledFilter(toolFunctionalitiesFilter);

            var toolInputDataFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolInputData',
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_INPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_INPUTDATA'
            });
            $scope.filtersManager.addAvailabledFilter(toolInputDataFilter);

            var toolOutputDataFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolOutputData',
                alias: 'toolOutputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_OUTPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_OUTPUTDATA'
            });
            $scope.filtersManager.addAvailabledFilter(toolOutputDataFilter);

            var toolFileEncodingsFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.toolFileEncodings',
                alias: 'toolFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FILE_ENCODINGS',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FILE_ENCODINGS'
            });
            $scope.filtersManager.addAvailabledFilter(toolFileEncodingsFilter);

            var viewModeLine = {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'};
            var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            $scope.viewModes = [viewModeGrid, viewModeLine];
    		$scope.viewMode = viewModeGrid;

            $scope.orderDirection = true;
            var orderTitle = {id: 'title', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'};
            var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            $scope.orderProps = [orderTitle, orderPublicationDate];
            $scope.orderProp = orderPublicationDate;
        }

        function init() {
        	initScopeVariables();
        }
        init();

	}]);