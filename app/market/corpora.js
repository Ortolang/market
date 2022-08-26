'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Corpora
 * @description
 * # Corpora
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$location', 'SearchProvider', 'Helper', function ($scope, $location, SearchProvider, Helper) {

        $scope.seeMore = function (value) {
            $location.path("/market/corpora/cluster/" + value);

        };

        (function init() {
            // Written
            $scope.searchWrittenCorpora = SearchProvider.make();
            $scope.searchWrittenCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsWrittenCorpora = { type: 'Corpus', 'corporaType.id': 'written_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'publicationDate', orderDir: 'desc' };
            // Speech
            $scope.searchSpeechCorpora = SearchProvider.make();
            $scope.searchSpeechCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsSpeechCorpora = { type: 'Corpus', 'corporaType.id': 'speech_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'publicationDate', orderDir: 'desc' };
            // Multimodal
            $scope.searchMultimodalCorpora = SearchProvider.make();
            $scope.searchMultimodalCorpora.setActiveOrderProp('publicationDate', true);
            $scope.paramsMultimodalCorpora = { type: 'Corpus', 'corporaType.id': 'multimodal_corpora', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'publicationDate', orderDir: 'desc' };
        }());

    }]);
