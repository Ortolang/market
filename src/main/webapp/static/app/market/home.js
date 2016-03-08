'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', 'Search', 'FacetedFilterManager', 'StaticWebsite',
        function ($scope, Search, FacetedFilterManager, StaticWebsite) {

            function initScopeVariables() {
                $scope.StaticWebsite = StaticWebsite;
                $scope.staticWebsiteBase = StaticWebsite.getStaticWebsiteBase();

                $scope.filtersManager = FacetedFilterManager.make();

                Search.setActiveOrderProp('publicationDate', true);
            }

            function init() {
                initScopeVariables();
                $scope.params = '{"title":"","limit":"10"}';
            }
            init();

        }]);
