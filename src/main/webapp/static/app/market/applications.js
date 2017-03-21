'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'SearchProvider', 'Helper', function ($scope, SearchProvider, Helper) {

        (function init() {
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            var params = {};
            	params.type = 'applications';
                params.includes = Helper.includedItemFields;
                params.orderProp = 'publicationDate';
                params.orderDir = 'desc';
                params.archive = false;
            $scope.params = angular.toJson(params);
        }());

    }]);
