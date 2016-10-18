'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$location', 'SearchProvider', 'FacetedFilterManager', function ($scope, $location, SearchProvider, FacetedFilterManager) {

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

        $scope.$on('$routeUpdate', function () {
            isHome();
        });

        function isHome() {
            $scope.corporaHome = Object.keys($location.search()).length === 0;
        }

        (function init() {
            var workspacePrefix = 'ortolang-workspace-json.';
            var metaLatestSnapshotPrefix = 'ortolang-workspace-json.latestSnapshot.';
            var metaItemPrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.';
            var metaWorkspacePrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.';
            var metaRatingPrefix = 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.';
            // Written
            $scope.searchWrittenCorpora = SearchProvider.make();
            $scope.searchWrittenCorpora.setActiveOrderProp('rank', true);
            $scope.paramsWrittenCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:written_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            // Speech
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('rank', true);
            $scope.paramsSpeechCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:speech_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            // Multimodal
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('rank', true);
            $scope.paramsMultimodalCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:multimodal_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';

            isHome();

            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init('Corpus', filters);
            $scope.typeFilter = $scope.filtersManager.getFilter('type');
            $scope.search = SearchProvider.make();
        }());

    }]);
