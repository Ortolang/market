'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductionsCtrl
 * @description
 * # ProductionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProductionsCtrl', ['$scope', 'User', 'SearchProvider',
        function ($scope, User, SearchProvider) {
            $scope.loadProductions = function () {
	            $scope.search = SearchProvider.make();
	            $scope.search.setActiveOrderProp('publicationDate', true);
                $scope.params = '{"contributors.entity.meta_ortolang-referential-json.username[]": "' + User.key + '"}';
            };
        }
]);
