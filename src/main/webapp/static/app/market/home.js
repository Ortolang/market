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

                var wsAliasFilter = FacetedFilter.make({
                    id: 'meta_ortolang-workspace-json.wsalias',
                    alias: 'wsalias',
                    type: 'array'
                });
                $scope.filtersManager.addAvailableFilter(wsAliasFilter);

                var optMC4 = OptionFacetedFilter.make({
                    label: 'mc4',
                    value: 'mc4',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optMC4);
                var optDemonette = OptionFacetedFilter.make({
                    label: 'demonette',
                    value: 'demonette',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optDemonette);
                var optLA = OptionFacetedFilter.make({
                    label: 'litteracieavancee',
                    value: 'litteracieavancee',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optLA);
                var optCorpus14 = OptionFacetedFilter.make({
                    label: 'corpus14',
                    value: 'corpus14',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optCorpus14);
                var optComere = OptionFacetedFilter.make({
                    label: 'comere',
                    value: 'comere',
                    length: 1
                });
                wsAliasFilter.putSelectedOption(optComere);
                $scope.filtersManager.addFilter(wsAliasFilter);

                Search.setActiveOrderProp('publicationDate', true);
            }

            function init() {
                initScopeVariables();
                $scope.query = $scope.filtersManager.toQuery();
            }
            init();

        }]);
