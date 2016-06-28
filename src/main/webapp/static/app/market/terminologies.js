'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Terminologies
 * @description
 * # Terminologies
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TerminologiesCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', '$translate', 'SearchProvider', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, $translate, SearchProvider) {

        function addAvailableFilters() {
            $scope.typeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
                alias: 'type',
                label: 'MARKET.RESOURCE_TYPE',
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: $translate.instant('ITEM.TYPE.VALUES.TERMINO'),
                        value: $translate.instant('ITEM.TYPE.VALUES.TERMINO'),
                        length: 1
                    })
                ],
                lockOptions: true,
                lock: true
            });
            $scope.typeFilter.putSelectedOption($scope.typeFilter.getOption($translate.instant('ITEM.TYPE.VALUES.TERMINO')));
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            var terminoTypeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoType.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoType',
                alias: 'terminoType',
                label: 'ITEM.TERMINO_TYPE.LABEL',
                resetLabel: 'ITEM.TERMINO_TYPE.RESETLABEL',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(terminoTypeFilter);

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

        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            $scope.search = SearchProvider.make();
        }

        init();
    }]);