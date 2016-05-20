'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SearchCorpora
 * @description
 * # SearchCorpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SearchCorporaCtrl', ['$scope', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'SearchProvider', function ($scope, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, SearchProvider) {

        function addAvailableFilters() {

            $scope.typeFilter = FacetedFilter.make({
                id: 'type',
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
            $scope.typeFilter.putSelectedOption($scope.typeFilter.getOption('Corpus'));
            $scope.filtersManager.addAvailableFilter($scope.typeFilter);

            var annotationLevelsFilter = FacetedFilter.make({
                id: 'annotationLevels.key',
                alias: 'annotationLevels',
                type: 'array',
                label: 'MARKET.FACET.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.FACET.ALL_ANNOTATION_LEVEL'
            });
            $scope.filtersManager.addAvailableFilter(annotationLevelsFilter);

            var corporaFormatsFilter = FacetedFilter.make({
                id: 'corporaFormats.key',
                alias: 'corporaFormats',
                type: 'array',
                label: 'MARKET.FACET.TEXT_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT'
            });
            $scope.filtersManager.addAvailableFilter(corporaFormatsFilter);

            var corporaDataTypesFilter = FacetedFilter.make({
                id: 'corporaDataTypes.key',
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            });
            $scope.filtersManager.addAvailableFilter(corporaDataTypesFilter);

            var corporaLanguageTypeFilter = FacetedFilter.make({
                id: 'corporaLanguageType.key',
                alias: 'corporaLanguageType',
                label: 'MARKET.FACET.CORPORA_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE'
            });
            $scope.filtersManager.addAvailableFilter(corporaLanguageTypeFilter);

            var corporaFileEncodingsFilter = FacetedFilter.make({
                id: 'corporaFileEncodings.key',
                alias: 'corporaFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TEXT_ENCODING',
                resetLabel: 'MARKET.FACET.ALL_TEXT_ENCODING'
            });
            $scope.filtersManager.addAvailableFilter(corporaFileEncodingsFilter);

            var corporaTypeFilter = FacetedFilter.make({
                id: 'corporaType.key',
                alias: 'corporaType',
                label: 'MARKET.FACET.CORPORA_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(corporaTypeFilter);

            var corporaLanguagesFilter = FacetedFilter.make({
                id: 'corporaLanguages.key',
                alias: 'corporaLanguages',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_LANG',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailableFilter(corporaLanguagesFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'statusOfUse.key',
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
