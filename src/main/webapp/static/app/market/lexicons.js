'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Lexicons
 * @description
 * # Lexicons
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LexiconsCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', function ($scope, FacetedFilterManager, SearchProvider) {

        var filters = [
            {
                alias: 'lexiconInputType',
                label: 'MARKET.FACET.LEXICON_INPUT_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_INPUT_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'lexiconDescriptionTypes',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_DESCRIPTION_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'lexiconInputLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_INPUT_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            },
            {
                alias: 'lexiconDescriptionLanguages',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG'
            },
            {
                alias: 'lexiconFormats',
                type: 'array',
                label: 'MARKET.FACET.LEXICON_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_FORMAT'
            },
            {
                alias: 'lexiconLanguageType',
                label: 'MARKET.FACET.LEXICON_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_LANGUAGE_TYPE'
            }
        ];

        (function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init('lexicons', filters);
            $scope.typeFilter = $scope.filtersManager.getFilter('type');
            $scope.search = SearchProvider.make();
        }());

    }]);
