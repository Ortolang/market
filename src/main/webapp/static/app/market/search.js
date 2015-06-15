'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Search
 * @description
 * # Search
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SearchCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'ItemManager', function ($scope, icons, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, ItemManager) {

        function initScopeVariables() {
            $scope.query = '';
            $scope.items = ItemManager.make();

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.typeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.type',
                alias: 'type',
                label: 'MARKET.RESOURCE_TYPE',
                resetLabel: 'MARKET.ALL_RESOURCE',
                priority: 'high',
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
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter($scope.typeFilter);

            var producersFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.producers',
                alias: 'producers',
                type: 'array',
                visibility: false,
                label: 'MARKET.FACET.PRODUCERS',
                resetLabel: 'MARKET.FACET.ALL_PRODUCERS'
            });
            $scope.filtersManager.addAvailabledFilter(producersFilter);

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
