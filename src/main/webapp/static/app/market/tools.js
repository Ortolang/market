'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Tools
 * @description
 * # Tools
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'SearchProvider', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, SearchProvider) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
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
            $scope.typeFilter.putSelectedOption($scope.typeFilter.getOption('Outil'));
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            var toolLanguagesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolLanguages.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolLanguages',
                alias: 'toolLanguages',
                type: 'array',
                label: 'MARKET.FACET.TOOL_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(toolLanguagesFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.statusOfUse.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(statusOfUseFilter);

            var toolFunctionalitiesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolFunctionalities.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolFunctionalities',
                alias: 'toolFunctionalities',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FUNCTIONALITY'
            });
            $scope.filtersManager.addAvailableFilter(toolFunctionalitiesFilter);

            var toolInputDataFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolInputData.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolInputData',
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_INPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_INPUTDATA'
            });
            $scope.filtersManager.addAvailableFilter(toolInputDataFilter);

            var toolOutputDataFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolOutputData.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolOutputData',
                alias: 'toolOutputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_OUTPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_OUTPUTDATA'
            });
            $scope.filtersManager.addAvailableFilter(toolOutputDataFilter);

            var toolFileEncodingsFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolFileEncodings.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.toolFileEncodings',
                alias: 'toolFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FILE_ENCODINGS',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FILE_ENCODINGS'
            });
            $scope.filtersManager.addAvailableFilter(toolFileEncodingsFilter);
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            $scope.search = SearchProvider.make();
        }

        init();

    }]);
