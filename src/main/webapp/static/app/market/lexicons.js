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
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconInputType',
                alias: 'lexiconInputType',
                label: 'MARKET.FACET.LEXICON_INPUT_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_INPUT_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconDescriptionTypes',
                alias: 'lexiconDescriptionTypes',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_DESCRIPTION_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconInputLanguages',
                alias: 'lexiconInputLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_INPUT_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconDescriptionLanguages',
                alias: 'lexiconDescriptionLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconFormats',
                alias: 'lexiconFormats',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_FORMAT'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconLanguageType',
                alias: 'lexiconLanguageType',
                label: 'MARKET.FACET.LEXICON_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_LANGUAGE_TYPE'
            }));
        }

        function addCustomProjections() {
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconInputType', 'lexiconInputType');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconDescriptionTypes', 'lexiconDescriptionTypes');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconInputLanguages', 'lexiconInputLanguages');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconDescriptionLanguages', 'lexiconDescriptionLanguages');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconFormats', 'lexiconFormats');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.lexiconLanguageType', 'lexiconLanguageType');
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            addCustomProjections();
        }

        init();

    }]);
