'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Tools
 * @description
 * # Tools
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', 'Helper', function ($scope, FacetedFilterManager, SearchProvider, Helper) {

        (function init() {
            $scope.searchTool = SearchProvider.make();
            $scope.searchTool.setActiveOrderProp('publicationDate', true);
            $scope.paramsTool = { type: 'Outil', archive: false, includes: Helper.includedItemFields, size: 200, orderProp: 'publicationDate', orderDir: 'desc' };

            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init();
            $scope.search = SearchProvider.make();
        }());
        
    }]);
