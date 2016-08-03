'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Lexicons
 * @description
 * # Lexicons
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LexiconsCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'SearchProvider', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, SearchProvider) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.type',
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
            $scope.typeFilter.putSelectedOption($scope.typeFilter.getOption('Lexique'));
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);
            
            var lexiconInputTypeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconInputType.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconInputType',
                alias: 'lexiconInputType',
                label: 'MARKET.FACET.LEXICON_INPUT_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_INPUT_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(lexiconInputTypeFilter);

            var lexiconDescriptionTypesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconDescriptionTypes.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconDescriptionTypes',
                alias: 'lexiconDescriptionTypes',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_DESCRIPTION_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(lexiconDescriptionTypesFilter);

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

            var lexiconInputLanguagesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconInputLanguages.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconInputLanguages',
                alias: 'lexiconInputLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_INPUT_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            });
            $scope.filtersManager.addAvailableFilter(lexiconInputLanguagesFilter);

            var lexiconDescriptionLanguagesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconDescriptionLanguages.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconDescriptionLanguages',
                alias: 'lexiconDescriptionLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            });
            $scope.filtersManager.addAvailableFilter(lexiconDescriptionLanguagesFilter);

            var lexiconFormatsLanguagesFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconFormats.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconFormats',
                alias: 'lexiconFormats',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_FORMAT'
            });
            $scope.filtersManager.addAvailableFilter(lexiconFormatsLanguagesFilter);

            var lexiconLanguageTypeFilter = FacetedFilter.make({
                id: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconLanguageType.key',
                path: 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.lexiconLanguageType',
                alias: 'lexiconLanguageType',
                label: 'MARKET.FACET.LEXICON_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_LANGUAGE_TYPE'
            });
            $scope.filtersManager.addAvailableFilter(lexiconLanguageTypeFilter);
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            $scope.search = SearchProvider.make();
        }

        init();

    }]);
