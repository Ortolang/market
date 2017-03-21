'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Terminologies
 * @description
 * # Terminologies
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TerminologiesCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', function ($scope, FacetedFilterManager, SearchProvider) {

        var filters = [
            // 1st level
            {
                alias: 'terminoType',
                label: 'ITEM.TERMINO_TYPE.LABEL',
                resetLabel: 'ITEM.TERMINO_TYPE.RESETLABEL',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'terminoLanguageType',
                label: 'ITEM.TERMINO_LANGUAGE_TYPE.LABEL',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            // 2nd level
            {
                alias: 'terminoStructureType',
                // type: 'array',
                label: 'ITEM.TERMINO_STRUCTURE_TYPE.LABEL'
            },
            {
                alias: 'terminoDescriptionTypes',
                type: 'array',
                label: 'ITEM.TERMINO_DESCRIPTION_FIELD.LABEL'
            },
            {
                alias: 'terminoInputLanguages',
                type: 'array',
                label: 'ITEM.TERMINO_INPUT_LANGUAGE.LABEL'
            },
            {
                alias: 'terminoFormat',
                // type: 'array',
                label: 'ITEM.TERMINO_FORMAT.LABEL'
            },
            {
                alias: 'terminoInputCount',
                // type: 'array',
                label: 'ITEM.TERMINO_INPUT_COUNT.LABEL'
            }
        ];

        (function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init('terminologies', filters);
            $scope.typeFilter = $scope.filtersManager.getFilter('type');
            $scope.search = SearchProvider.make();
        }());

    }]);
