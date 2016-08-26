'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$location', 'SearchProvider', function ($scope, $location, SearchProvider) {

        $scope.search = function () {
            $location.url('market/search/corpora').search('content', $scope.content);
        };

        function init() {
            var workspacePrefix = 'ortolang-workspace-json.';
            var metaLatestSnapshotPrefix = 'ortolang-workspace-json.latestSnapshot.';
            var metaItemPrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.';
            var metaWorkspacePrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.';
            var metaRatingPrefix = 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.';
            // Written
            $scope.searchWrittenCorpora = SearchProvider.make();
            $scope.searchWrittenCorpora.setActiveOrderProp('rank', false);
            $scope.paramsWrittenCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:written_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            // Speech
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('rank', false);
            $scope.paramsSpeechCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:speech_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            // Multimodal
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('rank', false);
            $scope.paramsMultimodalCorpora = '{"'+metaItemPrefix+'title":"", "'+metaItemPrefix+'type": "Corpus", "'+metaItemPrefix+'corporaType.key":"referential:multimodal_corpora", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName", "'+workspacePrefix+'archive":false, "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
        }

        init();

    }]);
