'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Tools
 * @description
 * # Tools
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', function ($scope, FacetedFilterManager, SearchProvider) {

        var filters = [
            {
                alias: 'toolLanguages',
                type: 'array',
                label: 'MARKET.FACET.TOOL_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'toolFunctionalities',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FUNCTIONALITY'
            },
            {
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_INPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_INPUTDATA'
            },
            {
                alias: 'toolOutputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_OUTPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_OUTPUTDATA'
            },
            {
                alias: 'toolFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FILE_ENCODINGS',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FILE_ENCODINGS'
            }
        ];

        (function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init('Outil', filters);
            $scope.typeFilter = $scope.filtersManager.getFilter('type');
            $scope.search = SearchProvider.make();
        }());

    }]);
