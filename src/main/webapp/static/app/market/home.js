'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', 'SearchProvider', 'FacetedFilterManager', 'StaticWebsite',
        function ($scope, SearchProvider, FacetedFilterManager, StaticWebsite) {

            function initScopeVariables() {
                $scope.StaticWebsite = StaticWebsite;
                $scope.staticWebsiteBase = StaticWebsite.getStaticWebsiteBase();
            }

            function init() {
                initScopeVariables();
                $scope.searchRecents = SearchProvider.make();
                $scope.searchRecents.setActiveOrderProp('rank', false);
                $scope.paramsRecents = '{"title":"", "fields":"key,system-trustrank-json.rank,ortolang-item-json.title,ortolang-item-json.type,ortolang-item-json.image,ortolang-item-json.publicationDate,ortolang-workspace-json.wskey,ortolang-workspace-json.wsalias,ortolang-workspace-json.snapshotName", "limit":"15", "orderProp":"rank", "orderDir":"desc"}';
            }
            init();

        }]);
