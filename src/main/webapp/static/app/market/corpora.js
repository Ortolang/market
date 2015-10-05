'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

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
                id: 'meta_ortolang-item-json.annotationLevels',
                alias: 'annotationLevels',
                type: 'array',
                label: 'MARKET.FACET.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.FACET.ALL_ANNOTATION_LEVEL'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaFormats',
                alias: 'corporaFormats',
                type: 'array',
                label: 'MARKET.FACET.TEXT_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaDataTypes',
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaLanguageType',
                alias: 'corporaLanguageType',
                label: 'MARKET.FACET.CORPORA_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaFileEncodings',
                alias: 'corporaFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TEXT_ENCODING',
                resetLabel: 'MARKET.FACET.ALL_TEXT_ENCODING'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaType',
                alias: 'corporaType',
                label: 'MARKET.FACET.CORPORA_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA',
                priority: 'high',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Écrit',
                        value: 'Écrit',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Oral',
                        value: 'Oral',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Multimodal',
                        value: 'Multimodal',
                        length: 1
                    })
                ],
                lockOptions: true,
                view: 'dropdown-faceted-filter'
            }));

            $scope.filtersManager.addAvailableFilter(FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaLanguages',
                alias: 'corporaLanguages',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_LANG',
                resetLabel: 'MARKET.FACET.ALL_LANG',
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
        }

        function addCustomProjections() {
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaLanguages', 'corporaLanguages');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaType', 'corporaType');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaFormats', 'corporaFormats');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaFileEncodings', 'corporaFileEncodings');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaDataTypes', 'corporaDataTypes');
            $scope.filtersManager.addCustomProjection('meta_ortolang-item-json.corporaLanguageType', 'corporaLanguageType');
        }

        function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            addAvailableFilters();
            addCustomProjections();
        }

        init();

    }]);
