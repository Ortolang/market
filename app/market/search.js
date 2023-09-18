'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Search
 * @description
 * # Search
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SearchCtrl', ['$scope', 'FacetedFilterManager', 'OptionFacetedFilter', 'SearchProvider', 'Settings', 
        function ($scope, FacetedFilterManager, OptionFacetedFilter, SearchProvider, Settings) {

        const filters = [
            {
                alias: 'type',
                label: 'MARKET.RESOURCE_TYPE',
                resetLabel: 'MARKET.ALL_RESOURCE',
                priority: 'high',
                view: 'dropdown-faceted-filter',
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
                        label: 'Terminologie',
                        value: 'Terminologie',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Outil',
                        value: 'Outil',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Projet intégré',
                        value: 'Projet intégré',
                        length: 1
                    })
                ],
            },
            {
                alias: 'statusOfUse',
                type: 'object',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'producers',
                type: 'array',
                label: 'MARKET.FACET.PRODUCER',
                resetLabel: 'MARKET.FACET.ALL_PRODUCER',
                priority: 'high',
            },
            // Corpora
            {
                alias: 'annotationLevels',
                type: 'array',
                label: 'MARKET.FACET.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.FACET.ALL_ANNOTATION_LEVEL'
            },
            {
                alias: 'corporaFormats',
                type: 'array',
                label: 'MARKET.FACET.TEXT_FORMAT',
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT',
                priority: 'high',
            },
            {
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            },
            {
                alias: 'corporaLanguageType',
                    type: 'object',
                label: 'MARKET.FACET.CORPORA_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_LANGUAGE_TYPE'
            },
            {
                alias: 'corporaFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TEXT_ENCODING',
                resetLabel: 'MARKET.FACET.ALL_TEXT_ENCODING'
            },
            {
                alias: 'corporaType',
                type: 'object',
                label: 'MARKET.FACET.CORPORA_TYPE',
                resetLabel: 'MARKET.FACET.ALL_CORPORA',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'corporaLanguages',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_LANG',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            // // Lexicon
            {
                alias: 'lexiconInputType',
                type: 'object',
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
                resetLabel: 'MARKET.FACET.ALL_LEXICON_FORMAT',
                priority: 'high',
            },
            {
                alias: 'lexiconLanguageType',
                type: 'object',
                label: 'MARKET.FACET.LEXICON_LANGUAGE_TYPE',
                resetLabel: 'MARKET.FACET.ALL_LEXICON_LANGUAGE_TYPE'
            },
            // Tools
            {
                alias: 'toolLanguages',
                type: 'array',
                label: 'MARKET.FACET.TOOL_LANGUAGE',
                resetLabel: 'MARKET.FACET.ALL_LANG',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            },
            {
                alias: 'toolFunctionalities',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FUNCTIONALITY',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FUNCTIONALITY'
            },
            {
                alias: 'toolInputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_INPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_INPUTDATA'
            },
            {
                alias: 'toolOutputData',
                type: 'array',
                label: 'MARKET.FACET.TOOL_OUTPUTDATA',
                resetLabel: 'MARKET.FACET.ALL_TOOL_OUTPUTDATA'
            },
            {
                alias: 'toolFileEncodings',
                type: 'array',
                label: 'MARKET.FACET.TOOL_FILE_ENCODINGS',
                resetLabel: 'MARKET.FACET.ALL_TOOL_FILE_ENCODINGS'
            },
            // Terminology
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

        $scope.$on('$routeChangeStart', function ($event, next, current) {
            if (Object.keys(current.params).length > 0) {
                Settings.putSearch('corpora', current.params);
            }
        });

        (function init() {
            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init(undefined, filters);
            $scope.search = SearchProvider.make();
        }());

    }]);
