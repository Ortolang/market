'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'ItemManager', function ($scope, icons, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, ItemManager) {

        function initScopeVariables() {
    		$scope.query = '';
    		$scope.items = ItemManager.make();

        	$scope.filtersManager = FacetedFilterManager.make();

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
            $scope.filtersManager.addAvailabledFilter($scope.typeFilter);

            var annotationLevelsFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.annotationLevels',
                alias: 'annotationLevels',
                type: 'array',
                label: 'MARKET.FACET.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.FACET.ALL_ANNOTATION_LEVEL'
            });
            $scope.filtersManager.addAvailabledFilter(annotationLevelsFilter);

            var corporaFormatsFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaFormats',
                alias: 'corporaFormats',
                type: 'array',
                label: 'MARKET.FACET.TEXT_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT'
            });
            $scope.filtersManager.addAvailabledFilter(corporaFormatsFilter);

            var corporaDataTypesFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaDataTypes',
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            });
            $scope.filtersManager.addAvailabledFilter(corporaDataTypesFilter);

            var corporaLanguageTypeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaLanguageType',
                alias: 'corporaLanguageType',
                label: 'MARKET.FACET.CORPORA_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE'
            });
            $scope.filtersManager.addAvailabledFilter(corporaLanguageTypeFilter);

            var corporaFileEncodingsFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaFileEncodings',
                alias: 'corporaFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TEXT_ENCODING',
                resetLabel: 'MARKET.FACET.ALL_TEXT_ENCODING'
            });
            $scope.filtersManager.addAvailabledFilter(corporaFileEncodingsFilter);

            var corpusTypeFilter = FacetedFilter.make({
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
            });
            $scope.filtersManager.addAvailabledFilter(corpusTypeFilter);

            var languageFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.corporaLanguages',
                alias: 'corporaLanguages',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_LANG',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter(languageFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUSOFUSE',
                resetLabel: 'MARKET.FACET.ALL_STATUSOFUSE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter(statusOfUseFilter);

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