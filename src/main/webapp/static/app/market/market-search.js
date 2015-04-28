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
            
            var filters = {};
            angular.forEach($scope.filtersManager.getFilters(), function(filter) {

                if(filter.getType() === 'string') {
                    filters[filter.id] = filter.value;
                } else if(filter.getType() === 'array') {
                    filters[filter.id] = [filter.value]; //TODO add to array if exits
                } else {
                    filters[filter.id] = filter.value;
                }
            });

            if ($scope.content && $scope.content !== '') {
                filters.content = $scope.content;
            }
            $location.search(filters).path('/search');
            
        };

        $scope.setFilter = function (filter, value) {
            addFilter(filter, value);
            // applyFilters();
            $scope.search();
        };

        $scope.removeFilter = function (filter) {
            $scope.filtersManager.removeFilter(filter);
            // applyFilters();
            $scope.search();
        };

        function addFilter (filter, value) {

            var opt;
            angular.forEach(filter.options, function(facetedOption) {
                if(facetedOption.getValue() === value) {
                    opt = facetedOption;
                }
            });

            if(opt !== undefined) {
                filter.value = value;
                filter.selected = opt;

                $scope.filtersManager.addFilter(filter);
            }
        }

        $scope.searchContent = function (content, filters) {
            var queryBuilder = QueryBuilderService.make({
                projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.statusOfUse as statusOfUse, meta_ortolang-item-json.primaryLanguage as primaryLanguage, meta_ortolang-item-json.typeOfCorpus as typeOfCorpus, meta_ortolang-item-json.annotationLevel as annotationLevel', 
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
                    queryBuilder.containsText('any()', contentPart);
                });
            }

            for(var filterName in filters) {
                queryBuilder.and();
                if(angular.isArray(filters[filterName])) {
                    queryBuilder.in(filterName, filters[filterName]);
                } else {
                    queryBuilder.equals(filterName, filters[filterName]);
                }
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                //TODO clean removes
                $scope.items = [];

                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);
                    $scope.items.push(jsEntry);

                    var i = 0;
                    for (i; i < $scope.facetedFilters.length; i++) {
                        if (jsEntry[$scope.facetedFilters[i].getAlias()]) {
                            addOptionFilter($scope.facetedFilters[i], jsEntry[$scope.facetedFilters[i].getAlias()]);
                        }
                    }

                    // i = 0;
                    // for (i; i < $scope.subFacetedFilters.length; i++) {
                    //     if (jsEntry[$scope.subFacetedFilters[i].getAlias()]) {
                    //         addOptionFilter($scope.subFacetedFilters[i], jsEntry[$scope.subFacetedFilters[i].getAlias()]);
                    //     }
                    // }
                });
            }, function (reason) {
                console.error(reason);
            });
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


        function applyFilters () {
            var filters = {};

            angular.forEach($scope.filtersManager.getFilters(), function(filter) {

                if(filter.getType() === 'string') {
                    filters[filter.id] = filter.value;
                } else if(filter.getType() === 'array') {
                    filters[filter.id] = [filter.value];
                } else {
                    filters[filter.id] = filter.value;
                }
                $scope.visibleFacetedFilters.addFilter(filter);

                angular.forEach(filter.selected.getSubFilters(), function(subFilter) {
                    $scope.visibleFacetedFilters.addFilter(subFilter);
                });
            });

            if (filters) {
                // $scope.applyFilters = filters;
                $scope.searchContent($scope.content, filters);
            }
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            // $scope.applyFilters = {};

            $scope.filtersManager = FacetedFilterManager.make();

            $scope.facetedFilters = [];
            $scope.visibleFacetedFilters = FacetedFilterManager.make();

            var annotationLevelFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.annotationLevel',
                alias: 'annotationLevel',
                type: 'array',
                label: 'MARKET.CORPORA.ANNOTATION_LEVEL',
                resetLabel: 'MARKET.CORPORA.ANNOTATION_LEVEL'
            });
            $scope.facetedFilters.push(annotationLevelFilter);

            var corpusTypeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.typeOfCorpus',
                alias: 'typeOfCorpus',
                label: 'MARKET.CORPORA.CORPORA_TYPE',
                resetLabel: 'MARKET.CORPORA.CORPORA_TYPE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Écrit', 
                        value: 'Écrit',
                        length: 1,
                        subFilters: [annotationLevelFilter]
                    }),
                    OptionFacetedFilter.make({
                        label: 'Oral', 
                        value: 'Oral',
                        length: 1
                    }),
                    OptionFacetedFilter.make({
                        label: 'Multimodal', 
                        value: 'Multimodal',
                        length: 1
                    })
                ]
            });
            $scope.facetedFilters.push(corpusTypeFilter);

            var typeFilter = FacetedFilter.make({
                id: 'meta_ortolang-item-json.type', 
                alias: 'type',
                label: 'MARKET.ALL_RESOURCE',  
                resetLabel: 'MARKET.ALL_RESOURCE',
                options: [
                    OptionFacetedFilter.make({
                        label: 'Corpus', 
                        value: 'Corpus',
                        length: 1,
                        subFilters: [corpusTypeFilter]
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
                    }),
                    OptionFacetedFilter.make({
                        label: 'Projet intégré', 
                        value: 'Application',
                        length: 1
                    })
                ]
                
            });
            $scope.facetedFilters.push(typeFilter);
            $scope.visibleFacetedFilters.addFilter(typeFilter);
            
            // $scope.facetedFilters.push(FacetedFilter.make({
            //     id: 'meta_ortolang-item-json.statusOfUse', 
            //     alias: 'statusOfUse',
            //     label: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
            //     selected: 'MARKET.CORPORA.ALL_STATUSOFUSE', 
            //     resetLabel: 'MARKET.CORPORA.ALL_STATUSOFUSE',
            // }));

            // $scope.facetedFilters.push(FacetedFilter.make({
            //     id: 'meta_ortolang-item-json.primaryLanguage', 
            //     alias: 'primaryLanguage',
            //     label: 'MARKET.CORPORA.ALL_LANG', 
            //     selected: 'MARKET.CORPORA.ALL_LANG', 
            //     resetLabel: 'MARKET.CORPORA.ALL_LANG'
            // }));

            $scope.content = '';
        }

        function init() {
            initScopeVariables();
            // $rootScope.selectSearch();

            $scope.content = $routeParams.content;

            for(var paramName in $routeParams) {
                var i = 0;
                for (i; i < $scope.facetedFilters.length; i++) {
                    if ($scope.facetedFilters[i].id === paramName) {
                        addFilter($scope.facetedFilters[i], $routeParams[paramName]);

                    }
                }
            }

            // $scope.searchContent($routeParams.content);

            applyFilters();
        }
        init();

    }]);
