'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', '$routeParams', '$location', '$window', 'icons', 'ItemManager', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, $routeParams, $location, $window, icons, ItemManager, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        // Scope variables
        function initScopeVariables() {
            $scope.items = ItemManager.make();

            $scope.filtersManager = FacetedFilterManager.make();
            
            var titleFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.title',
                alias: 'title',
                type: 'array'
            });
            $scope.filtersManager.addAvailabledFilter(titleFilter);

            var optCorpus14 = OptionFacetedFilter.make({
                label: 'Corpus 14', 
                value: 'Corpus 14',
                length: 1
            });
            titleFilter.putSelectedOption(optCorpus14);
            var optLA = OptionFacetedFilter.make({
                label: 'Littéracie Avancée', 
                value: 'Littéracie Avancée',
                length: 1
            });
            titleFilter.putSelectedOption(optLA);
            var optComere = OptionFacetedFilter.make({
                label: 'CoMeRe (Communication médiée par les réseaux)', 
                value: 'CoMeRe (Communication médiée par les réseaux)',
                length: 1
            });
            titleFilter.putSelectedOption(optComere);
            $scope.filtersManager.addFilter(titleFilter);

            var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};            
            $scope.viewMode = viewModeGrid;
            $scope.orderDirection = true;
            var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            $scope.orderProp = orderPublicationDate;
        }

        function init() {
            initScopeVariables();

            $scope.query = $scope.filtersManager.toQuery();
        }
        init();

    }]);
