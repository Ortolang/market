'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'SearchProvider', function ($scope, SearchProvider) {

        (function init() {
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            var params = {type: 'applications'};
            $scope.params = angular.toJson(params);
        }());

    }]);
