'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', 'Search', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', 'StaticWebsite',
        function ($scope, Search, FacetedFilterManager, FacetedFilter, OptionFacetedFilter, StaticWebsite) {

            function initScopeVariables() {
                $scope.StaticWebsite = StaticWebsite;
                $scope.staticWebsiteBase = StaticWebsite.getStaticWebsiteBase();

                $scope.filtersManager = FacetedFilterManager.make();

                Search.setActiveOrderProp('publicationDate', true);
            }

            function init() {
                initScopeVariables();
                // $scope.query = $scope.filtersManager.toQuery() + ' LIMIT ' + 10;
            }
            init();

        }]);
