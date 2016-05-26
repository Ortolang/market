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
                $scope.searchRecents.setActiveOrderProp('publicationDate', true);
                $scope.paramsRecents = '{"title":"", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,item.producers,workspace.wskey,workspace.wsalias,workspace.snapshotName", "limit":"10", "orderProp":"publicationDate", "orderDir":"desc"}';
            }
            init();

        }]);
