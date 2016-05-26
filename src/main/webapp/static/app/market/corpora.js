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
            $scope.searchWrittenCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsWrittenCorpora = '{"title":"", "type": "Corpus", "corporaType.key":"referential:written_corpora", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,workspace.wskey,workspace.wsalias,workspace.snapshotName", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsSpeechCorpora = '{"title":"", "type": "Corpus", "corporaType.key":"referential:speech_corpora", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,workspace.wskey,workspace.wsalias,workspace.snapshotName", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsMultimodalCorpora = '{"title":"", "type": "Corpus", "corporaType.key":"referential:multimodal_corpora", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,workspace.wskey,workspace.wsalias,workspace.snapshotName", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
        }

        init();

    }]);
