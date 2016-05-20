'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', '$location', 'SearchProvider', function ($scope, $location, SearchProvider) {
        function init() {
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            $scope.params = '{"type": "Application"}';
        }
        init();
    }]);
