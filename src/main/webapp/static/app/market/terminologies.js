'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Terminologies
 * @description
 * # Terminologies
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TerminologiesCtrl', ['$scope', 'FacetedFilterManager', 'SearchProvider', 'Helper', function ($scope, FacetedFilterManager, SearchProvider, Helper) {

        (function init() {
            $scope.searchTerminologie = SearchProvider.make();
            $scope.searchTerminologie.setActiveOrderProp('rank', true);
            $scope.paramsTerminologie = { type: 'Terminologie', archive: false, includes: Helper.includedItemFields, size: 15, orderProp: 'rank', orderDir: 'desc' };

            $scope.filtersManager = FacetedFilterManager.make();
            $scope.filtersManager.init();
        }());

    }]);
