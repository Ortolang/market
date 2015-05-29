'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Lexicons
 * @description
 * # Lexicons
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LexiconsCtrl', ['$scope', 'icons', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'ItemManager', function ($scope, icons, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, ItemManager) {

        function initScopeVariables() {
    		$scope.query = '';
    		$scope.items = ItemManager.make();

        	$scope.filtersManager = FacetedFilterManager.make();

            var typeFilter = FacetedFilter.make({
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
            $scope.filtersManager.addAvailabledFilter(typeFilter);

            $scope.filtersManager.addFilter(typeFilter, typeFilter.getOption('Lexique'));

            // var lexiconInputTypeFilter = FacetedFilter.make({
            //     id: 'meta_ortolang-item-json.lexiconInputType',
            //     alias: 'lexiconInputType',
            //     label: 'MARKET.FACET.LEXICON_INPUT_TYPE',
            //     resetLabel: 'MARKET.FACET.ALL_LEXICON_INPUT_TYPE',
            //     priority: 'high',
            //     view: 'dropdown-faceted-filter'
            // });
            // $scope.filtersManager.addAvailabledFilter(lexiconInputTypeFilter);

            // var lexiconDescriptionTypesFilter = FacetedFilter.make({
            //     id: 'meta_ortolang-item-json.lexiconDescriptionTypes',
            //     alias: 'lexiconDescriptionTypes',
            //     type: 'array',
            //     label: 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE',
            //     resetLabel: 'MARKET.FACET.ALL_LEXICON_DESCRIPTION_TYPE',
            //     priority: 'high',
            //     view: 'dropdown-faceted-filter'
            // });
            // $scope.filtersManager.addAvailabledFilter(lexiconDescriptionTypesFilter);

            var statusOfUseFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.statusOfUse',
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUSOFUSE',
                resetLabel: 'MARKET.FACET.ALL_STATUSOFUSE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            });
            $scope.filtersManager.addAvailabledFilter(statusOfUseFilter);

            var lexiconInputLanguagesFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.lexiconInputLanguages',
                alias: 'lexiconInputLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_INPUT_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            });
            $scope.filtersManager.addAvailabledFilter(lexiconInputLanguagesFilter);

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
            
            $scope.query = $scope.filtersManager.toQuery();
        }
        init();

	}]);