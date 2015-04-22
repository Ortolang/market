'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:CorporaCtrl
 * @description
 * # CorporaCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', '$filter', 'JsonResultResource', 'QueryBuilderService', 'FacetedFilterManager', 'FacetedFilter', function ($scope, $rootScope, $routeParams, $location, $window, $filter, JsonResultResource, QueryBuilderService, FacetedFilterManager, FacetedFilter) {

        $scope.clickItem = function (entry) {
            if (entry.applicationUrl) {
                $window.open(entry.applicationUrl);
            } else {
                $location.path('/market/item/' + entry.key);
            }
        };

        $scope.setFilter = function (filter, value) {
            addFilter(filter, value);

            applyFilters();
        };

        function addFilter (filter, value) {

            var label;
            angular.forEach(filter.options, function(facetedOption) {
                if(facetedOption.value === value) {
                    label = facetedOption.label;
                    return filter;
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
                $scope.itemsFiltered = $filter('filter')($scope.items, filters);
            }
        }

        $scope.resetFilter = function () {
            $scope.filtersManager.resetFilter();
            applyFilters();
        };

        $scope.searchContent = function(content) {
            var queryBuilder = QueryBuilderService.make({
                projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.statusOfUse as statusOfUse, meta_ortolang-item-json.primaryLanguage as primaryLanguage', 
                source: 'collection'
            });

            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.equals('meta_ortolang-item-json.type', 'Corpus');
            
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
                    $scope.itemsFiltered.push(jsEntry);
                });
            }, function (reason) {
                console.error(reason);
            });
        };


        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.itemsFiltered = [];

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.facetedFilters = [];
            $scope.facetedFilters.push(FacetedFilter.make({
                id: 'statusOfUse', 
                label: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
                selected: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
                resetLabel: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
                options: [{
                    label: 'MARKET.CORPORA.FREE_USE', 
                    value: 'Libre'
                }, {
                    label: 'MARKET.CORPORA.FREE_NC_USE', 
                    value: 'Libre sans utilisation commerciale'
                }, {
                    label: 'MARKET.CORPORA.RESTRICTED_USE', 
                    value: 'Négociation nécessaire'
                }] 
            }));
            $scope.facetedFilters.push(FacetedFilter.make({
                id: 'primaryLanguage', 
                label: 'MARKET.CORPORA.ALL_LANG', 
                selected: 'MARKET.CORPORA.ALL_LANG', 
                resetLabel: 'MARKET.CORPORA.ALL_LANG',
                options: [
                    {
                        label: 'MARKET.CORPORA.FRENCH_LANG',
                        value: 'Français'
                    }
                ]
            }));

            $scope.content = '';
        }

        function init() {
            initScopeVariables();

            $scope.content = $routeParams.content;
            $scope.searchContent($scope.content);

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
