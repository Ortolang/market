'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Lexicons
 * @description
 * # Lexicons
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LexiconsCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', 'Helper', function ($scope, FacetedFilterManager, SearchProvider, Helper) {

        (function init() {
            $scope.searchLexicon = SearchProvider.make();
            $scope.searchLexicon.setActiveOrderProp('rank', true);
            $scope.paramsLexicon = { type: 'Lexique', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };

            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init();
        }());

    }]);
