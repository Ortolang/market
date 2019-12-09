'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ClusterCtrl
 * @description
 * # ClusterCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ClusterCtrl', ['$scope', '$routeParams', 'SearchProvider', 'Helper', function ($scope, $routeParams, SearchProvider, Helper) {

        (function init() {
            $scope.search = SearchProvider.make();
            if ($routeParams.cluster) {
                $scope.corporatype = $routeParams.cluster;
                $scope.params = {
                    type: 'Corpus',
                    'corporaType.id': $routeParams.cluster,
                    archive: false,
                    includes: Helper.includedItemFields,
                    size: 500,
                    orderProp: 'rank',
                    orderDir: 'desc'
                };
            }
        }());

    }]);