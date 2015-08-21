'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', 'icons', 'ItemManager', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'StaticWebsite',
        function ($scope, icons, ItemManager, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, StaticWebsite) {

            // Scope variables
            function initScopeVariables() {
                $scope.StaticWebsite = StaticWebsite;

                $scope.items = ItemManager.make();

                $scope.filtersManager = FacetedFilterManager.make();

                var wsAliasFilter = FacetedFilter.make({
                    id: 'meta_ortolang-workspace-json.wsalias',
                    alias: 'wsalias',
                    type: 'array'
                });
                $scope.filtersManager.addAvailableFilter(wsAliasFilter);

                var optMC4 = OptionFacetedFilter.make({
                    label: 'mc4',
                    value: 'mc4',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optMC4);
                var optDemonette = OptionFacetedFilter.make({
                    label: 'demonette',
                    value: 'demonette',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optDemonette);
                var optLA = OptionFacetedFilter.make({
                    label: 'litteracieavancee',
                    value: 'litteracieavancee',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optLA);
                var optCorpus14 = OptionFacetedFilter.make({
                    label: 'corpus14',
                    value: 'corpus14',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optCorpus14);
                var optComere = OptionFacetedFilter.make({
                    label: 'comere',
                    value: 'comere',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optComere);
                $scope.filtersManager.addFilter(wsAliasFilter);

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
