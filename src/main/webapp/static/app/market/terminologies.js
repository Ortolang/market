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
            // Implicite facets
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

            // 1rst level
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

            var languageTypeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoLanguageType.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoLanguageType',
                alias: 'terminoLanguageType',
                label: 'ITEM.TERMINO_LANGUAGE_TYPE.LABEL',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(languageTypeFilter);

            // var statusOfUseFilter = FacetedFilter.make({
            //     id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.statusOfUse.key',
            //     path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.statusOfUse',
            //     alias: 'statusOfUse',
            //     label: 'MARKET.FACET.STATUS_OF_USE',
            //     resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
            //     priority: 'high',
            //     view: 'dropdown-faceted-filter'
            // });
            // $scope.filtersManager.addAvailableFilter(statusOfUseFilter);

            // 2nd level
            var structureTypesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoStructureType.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoStructureType',
                alias: 'terminoStructureType',
                type: 'array',
                label: 'ITEM.TERMINO_STRUCTURE_TYPE.LABEL'
            });
            $scope.filtersManager.addAvailableFilter(structureTypesFilter);

            var descriptionFieldsFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoDescriptionTypes.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoDescriptionTypes',
                alias: 'terminoDescriptionTypes',
                type: 'array',
                label: 'ITEM.TERMINO_DESCRIPTION_FIELD.LABEL'
            });
            $scope.filtersManager.addAvailableFilter(descriptionFieldsFilter);

            var inputLanguagesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoInputLanguages.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoInputLanguages',
                alias: 'terminoInputLanguages',
                type: 'array',
                label: 'ITEM.TERMINO_INPUT_LANGUAGE.LABEL'
            });
            $scope.filtersManager.addAvailableFilter(inputLanguagesFilter);

            var terminoFormatFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoFormat.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoFormat',
                alias: 'terminoFormat',
                type: 'array',
                label: 'ITEM.TERMINO_FORMAT.LABEL'
            });
            $scope.filtersManager.addAvailableFilter(terminoFormatFilter);

            var terminoInputCountFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoInputCount.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.terminoInputCount',
                alias: 'terminoInputCount',
                type: 'array',
                label: 'ITEM.TERMINO_INPUT_COUNT.LABEL'
            });
            $scope.filtersManager.addAvailableFilter(terminoInputCountFilter);

        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            $scope.search = SearchProvider.make();
        }

        init();
    }]);