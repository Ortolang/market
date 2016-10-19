'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Search
 * @description
 * # Search
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SearchCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', function ($scope, icons, FacetedFilterManager, FacetedFilter) {

        function initScopeVariables() {

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.typeFilter = FacetedFilter.makeTypeFilter(undefined, false);
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            var producersFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.producers',
                alias: 'producers',
                type: 'array',
                visibility: false,
                label: 'MARKET.FACET.PRODUCERS',
                resetLabel: 'MARKET.FACET.ALL_PRODUCERS'
            });
            $scope.filtersManager.addAvailableFilter(producersFilter);

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

        (function init() {
            initScopeVariables();
        }());

    }]);
