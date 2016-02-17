'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Lexicons
 * @description
 * # Lexicons
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LexiconsCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
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
            $scope.typeFilter.putSelectedOption($scope.typeFilter.getOption('Lexique'));
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);
            
            var lexiconInputTypeFilter = FacetedFilter.make({
                id: 'lexiconInputType.key',
                alias: 'lexiconInputType',
                label: 'MARKET.FACET.LEXICON_INPUT_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_INPUT_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(lexiconInputTypeFilter);

            var lexiconDescriptionTypesFilter = FacetedFilter.make({
                id: 'lexiconDescriptionTypes.key',
                alias: 'lexiconDescriptionTypes',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_DESCRIPTION_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(lexiconDescriptionTypesFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'statusOfUse.key',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(statusOfUseFilter);

            var lexiconInputLanguagesFilter = FacetedFilter.make({
                id: 'lexiconInputLanguages.key',
                alias: 'lexiconInputLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_INPUT_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            });
            $scope.filtersManager.addAvailableFilter(lexiconInputLanguagesFilter);

            var lexiconDescriptionLanguagesFilter = FacetedFilter.make({
                id: 'lexiconDescriptionLanguages.key',
                alias: 'lexiconDescriptionLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            });
            $scope.filtersManager.addAvailableFilter(lexiconDescriptionLanguagesFilter);

            var lexiconFormatsLanguagesFilter = FacetedFilter.make({
                id: 'lexiconFormats.key',
                alias: 'lexiconFormats',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_FORMAT'
            });
            $scope.filtersManager.addAvailableFilter(lexiconFormatsLanguagesFilter);

            var lexiconLanguageTypeFilter = FacetedFilter.make({
                id: 'lexiconLanguageType.key',
                alias: 'lexiconLanguageType',
                label: 'MARKET.FACET.LEXICON_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_LANGUAGE_TYPE'
            });
            $scope.filtersManager.addAvailableFilter(lexiconLanguageTypeFilter);
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
        }

        init();

    }]);
