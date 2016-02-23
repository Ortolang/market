'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Tools
 * @description
 * # Tools
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
                id: 'type',
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
                id: 'toolLanguages.key',
                alias: 'toolLanguages',
                type: 'array',
                label: 'MARKET.FACET.TOOL_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(toolLanguagesFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'statusOfUse.key',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(statusOfUseFilter);

            var toolFunctionalitiesFilter = FacetedFilter.make({
                id: 'toolFunctionalities.key',
                alias: 'toolFunctionalities',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FUNCTIONALITY'
            });
            $scope.filtersManager.addAvailableFilter(toolFunctionalitiesFilter);

            var toolInputDataFilter = FacetedFilter.make({
                id: 'toolInputData.key',
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_INPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_INPUTDATA'
            });
            $scope.filtersManager.addAvailableFilter(toolInputDataFilter);

            var toolOutputDataFilter = FacetedFilter.make({
                id: 'toolOutputData.key',
                alias: 'toolOutputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_OUTPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_OUTPUTDATA'
            });
            $scope.filtersManager.addAvailableFilter(toolOutputDataFilter);

            var toolFileEncodingsFilter = FacetedFilter.make({
                id: 'toolFileEncodings.key',
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
        }

        init();

    }]);
