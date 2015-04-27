'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', '$rootScope', '$filter', 'JsonResultResource', 'QueryBuilderService', 'FacetedFilterManager', 'FacetedFilter', 'OptionFacetedFilter', function ($scope, $location, $routeParams, $rootScope, $filter, JsonResultResource, QueryBuilderService, FacetedFilterManager, FacetedFilter, OptionFacetedFilter) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.setFilter = function (filter, value) {
            addFilter(filter, value);

            applyFilters();
        };

        function addFilter (filter, value) {

            var label;
            angular.forEach(filter.options, function(facetedOption) {
                if(facetedOption.getValue() === value) {
                    label = facetedOption.getLabel();
                }
            });

            if(label !== undefined) {
                filter.value = value;
                filter.selected = label;

                $scope.filtersManager.addFilter(filter);
            }
        }

        function applyFilters () {
            var filters = {};

            angular.forEach($scope.filtersManager.getFilters(), function(filter) {
                filters[filter.id] = filter.value;
            });

            if (filters) {
                $scope.applyFilters = filters;
            }
        }

        $scope.removeFilter = function (filter) {
            $scope.filtersManager.removeFilter(filter);
            applyFilters();
        };

        function addOptionFilter (filter, optionValue) {
            if(angular.isArray(optionValue)) {
                angular.forEach(optionValue, function(opt) {
                    filter.putOption(OptionFacetedFilter.make({
                        label: opt, 
                        value: opt,
                        length: 1
                    }));
                });
            } else {
                filter.putOption(OptionFacetedFilter.make({
                    label: optionValue, 
                    value: optionValue,
                    length: 1
                }));
            }
        }

        $scope.searchContent = function (content) {
            var queryBuilder = QueryBuilderService.make({
                projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.statusOfUse as statusOfUse, meta_ortolang-item-json.primaryLanguage as primaryLanguage', 
                source: 'collection'
            });

            queryBuilder.equals('status', 'published');
            
            var contentSplit = [];
            if (content && content !== '') {
                contentSplit = queryBuilder.tokenize(content);
            }
            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    queryBuilder.and();
                    queryBuilder.containsText('meta_ortolang-item-json.*', contentPart);
                });
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);
                    $scope.items.push(jsEntry);

                    var i = 0;
                    for (i; i < $scope.facetedFilters.length; i++) {
                        if (jsEntry[$scope.facetedFilters[i].id]) {
                            addOptionFilter($scope.facetedFilters[i], jsEntry[$scope.facetedFilters[i].id]);
                        }
                    }
                });
            }, function (reason) {
                console.error(reason);
            });
        };


        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.applyFilters = {};

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.facetedFilters = [];
            $scope.facetedFilters.push(FacetedFilter.make({
                id: 'type', 
                label: 'MARKET.ALL_RESOURCE', 
                selected: 'MARKET.ALL_RESOURCE', 
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Corpus', 
                        value: 'Corpus',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Lexique', 
                        value: 'Lexique',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Outil', 
                        value: 'Outil',
                        length: 1
                    })
                ]
                
            }));

            
            $scope.facetedFilters.push(FacetedFilter.make({
                id: 'statusOfUse', 
                label: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
                selected: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
                resetLabel: 'MARKET.CORPORA.ALL_STATUSOFUSE',
                
                
            }));

            $scope.facetedFilters.push(FacetedFilter.make({
                id: 'primaryLanguage', 
                label: 'MARKET.CORPORA.ALL_LANG', 
                selected: 'MARKET.CORPORA.ALL_LANG', 
                resetLabel: 'MARKET.CORPORA.ALL_LANG'
            }));

            $scope.content = '';
        }

        function init() {
            initScopeVariables();
            $rootScope.selectSearch();

            $scope.content = $routeParams.content;
            $scope.searchContent($routeParams.content);

            for(var paramName in $routeParams) {
                var i = 0;
                for (i; i < $scope.facetedFilters.length; i++) {
                    if ($scope.facetedFilters[i].id === paramName) {
                        addFilter($scope.facetedFilters[i], $routeParams[paramName]);
                    }
                }
            }

            applyFilters();
        }
        init();

    }]);
