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
            // $scope.searchRecents = SearchProvider.make();
            // $scope.searchRecents.setActiveOrderProp('publicationDate', true);
            // $scope.paramsRecents = '{"title":"", "type": "Corpus", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
            // $scope.searchFreeCorpora = SearchProvider.make();
            // $scope.searchFreeCorpora.setActiveOrderProp('publicationDate', true);
            // $scope.paramsFreeCorpora = '{"title":"", "type": "Corpus", "statusOfUse.key":"referential:free_use", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
            $scope.searchWrittenCorpora = SearchProvider.make();
            $scope.searchWrittenCorpora.setActiveOrderProp('rank', false);
            $scope.paramsWrittenCorpora = '{"title":"", "type": "Corpus", "ortolang-item-json.corporaType.key":"referential:written_corpora", "fields":"key,system-rating-json.score:rank,system-rating-json.esrAccessibility,ortolang-item-json.title,ortolang-item-json.type,ortolang-item-json.image,ortolang-item-json.publicationDate,ortolang-workspace-json.wskey,ortolang-workspace-json.wsalias,ortolang-workspace-json.snapshotName", "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('rank', false);
            $scope.paramsSpeechCorpora = '{"title":"", "type": "Corpus", "ortolang-item-json.corporaType.key":"referential:speech_corpora", "fields":"key,system-rating-json.score:rank,system-rating-json.esrAccessibility,ortolang-item-json.title,ortolang-item-json.type,ortolang-item-json.image,ortolang-item-json.publicationDate,ortolang-workspace-json.wskey,ortolang-workspace-json.wsalias,ortolang-workspace-json.snapshotName", "limit":"9", "orderProp":"rank", "orderDir":"desc"}';
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('rank', false);
            $scope.paramsMultimodalCorpora = '{"title":"", "type": "Corpus", "ortolang-item-json.corporaType.key":"referential:multimodal_corpora", "fields":"key,system-rating-json.score:rank,system-rating-json.esrAccessibility,ortolang-item-json.title,ortolang-item-json.type,ortolang-item-json.image,ortolang-item-json.publicationDate,ortolang-workspace-json.wskey,ortolang-workspace-json.wsalias,ortolang-workspace-json.snapshotName", "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
        }

        init();

    }]);
