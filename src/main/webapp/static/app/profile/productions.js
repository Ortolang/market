'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductionsCtrl
 * @description
 * # ProductionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProductionsCtrl', ['$scope', 'User', 'SearchProvider', 'Helper',
        function ($scope, User, SearchProvider, Helper) {
            $scope.loadProductions = function () {
	            $scope.search = SearchProvider.make();
	            $scope.search.setActiveOrderProp('publicationDate', true);
                $scope.params = {'contributors.entity.username.key[]': User.key, archive: false, includes: Helper.includedItemFields, orderProp: 'publicationDate', orderDir: 'desc'};
            };
        }
]);
