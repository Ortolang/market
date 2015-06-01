'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'ItemManager', function ($scope, icons, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, ItemManager) {

        function initScopeVariables() {
    		$scope.query = '';
    		$scope.items = ItemManager.make();

        	$scope.filtersManager = FacetedFilterManager.make();

            var typeFilter = FacetedFilter.make({
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
            $scope.filtersManager.addAvailabledFilter(typeFilter);

            $scope.filtersManager.addFilter(typeFilter, typeFilter.getOption('Application'));

            var viewModeLine = {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'};
            var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            $scope.viewModes = [viewModeGrid, viewModeLine];
    		$scope.viewMode = viewModeGrid;

            $scope.orderDirection = false;
            var orderTitle = {id: 'title', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'};
            var orderCreationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            $scope.orderProps = [orderTitle, orderCreationDate];
            $scope.orderProp = orderTitle;
        }

        function init() {
        	initScopeVariables();
            
            $scope.query = $scope.filtersManager.toQuery();
        }
        init();

	}]);