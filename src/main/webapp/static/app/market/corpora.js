'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$location', 'SearchProvider', 'FacetedFilterManager', 'Settings', 'Helper', function ($scope, $location, SearchProvider, FacetedFilterManager, Settings, Helper) {

        var filters = [
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
                resetLabel: 'MARKET.FACET.ALL_TEXT_FORMAT'
            },
            {
                alias: 'corporaDataTypes',
                type: 'array',
                label: 'MARKET.FACET.CORPORA_DATATYPES',
                resetLabel: 'MARKET.FACET.ALL_CORPORA_DATATYPES'
            },
            {
                alias: 'corporaLanguageType',
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
            {
                alias: 'statusOfUse',
                label: 'MARKET.FACET.STATUS_OF_USE',
                resetLabel: 'MARKET.FACET.ALL_STATUS_OF_USE',
                priority: 'high',
                view: 'dropdown-faceted-filter'
            }
        ];

        $scope.seeMore = function (value) {
            var corporaTypeFilter = $scope.filtersManager.getFilter('corporaType');
            $scope.$root.$broadcast('market-toolbar-set-filter', corporaTypeFilter, corporaTypeFilter.getOption(value));
        };

        function isHome() {
            $scope.corporaHome = Object.keys($location.search()).length === 0;
        }

        $scope.$on('$routeUpdate', function () {
            isHome();
        });

        $scope.$on('$routeChangeStart', function ($event, next, current) {
            if (Object.keys(current.params).length > 0) {
                Settings.putSearch('corpora', current.params);
            }
        });

        (function init() {
            // Written
            $scope.searchWrittenCorpora = SearchProvider.make();
            $scope.searchWrittenCorpora.setActiveOrderProp('rank', true);
            $scope.paramsWrittenCorpora = {type:'corpora', 'corporaType.id': 'written_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc'};
            // Speech
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('rank', true);
            $scope.paramsSpeechCorpora = {type:'corpora', 'corporaType.id': 'speech_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc'};
            // Multimodal
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('rank', true);
            $scope.paramsMultimodalCorpora = {type:'corpora', 'corporaType.id': 'multimodal_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc'};

            isHome();

            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init('corpora', filters);
            $scope.typeFilter = $scope.filtersManager.getFilter('type');
            $scope.search = SearchProvider.make();
        }());

    }]);
