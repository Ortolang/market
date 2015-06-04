'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketToolbar
 * @description
 * # marketToolbar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketToolbar', [ '$rootScope', '$routeParams', '$location', 'OptionFacetedFilter',  function ($rootScope, $routeParams, $location, OptionFacetedFilter) {
        return {
            restrict: 'E',
            scope: {
                type: '=',
                content: '=',
                query: '=',
                items: '=',
                viewMode: '=',
                viewModes: '=',
                orderProp: '=',
                orderDirection: '=',
                orderProps: '=',
                filtersManager: '=',
                preSelectedFilter: '=',
                searchPlaceHolder: '@'
            },
            templateUrl: 'market/directives/market-toolbar.html',
            link: {
                post : function (scope) {

                    scope.setFilter = function(filter, opt) {
                        addSelectedOptionFilter(filter, opt.getValue());

                        scope.filtersManager.addFilter(filter);
                        scope.applyFilters();
                    };

                    scope.switchFilter = function (filter, opt, apply) {
                        if (filter.hasSelectedOption(opt)) {
                            scope.filtersManager.removeOptionFilter(filter, opt);
                        } else {
                            addSelectedOptionFilter(filter, opt.getValue());

                            scope.filtersManager.addFilter(filter);
                        }

                        if(apply) {
                            scope.applyFilters();
                        }
                    };

                    scope.removeFilter = function (filter) {
                        scope.filtersManager.removeFilter(filter);
                        scope.applyFilters();
                    };

                    scope.applyFilters = function () {
                        scope.hideLowFacets();

                        $location.search(scope.filtersManager.urlParam(scope.content, scope.viewMode, scope.orderProp, scope.orderDirection));
                        scope.query = scope.filtersManager.toQuery(scope.content);
                    };

                    scope.toggleOrderBy = function (orderProp) {
                        if (scope.orderProp.id !== orderProp.id) {
                            scope.orderDirection = false;
                            scope.orderProp = orderProp;
                        } else {
                            scope.orderDirection = !scope.orderDirection;
                        }
                    };

                    scope.setViewMode = function(view) {
                        scope.viewMode = view;
                    };

                    scope.hasAppliedFacets = function() {
                        var i = 0;
                        for (i; i < scope.filtersManager.getFilters().length; i++) {
                            if (scope.filtersManager.getFilters()[i].hasSelectedOptions() && !scope.filtersManager.getFilters()[i].isLock()) {
                                return true;
                            }
                        }
                        return false;
                    };

                    scope.showLowFacets = function () {
                        scope.lowFacets = true;
                    };

                    scope.hideLowFacets = function () {
                        scope.lowFacets = false;
                    };

                    scope.showFacets = function () {
                        scope.facets = true;
                    };

                    scope.switchFacets = function () {
                        scope.facets = !scope.facets;
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

                    function addSelectedOptionFilter (filter, optionValue) {
                        if(angular.isArray(optionValue)) {
                            angular.forEach(optionValue, function(opt) {
                                filter.putSelectedOption(filter.getOption(opt));
                            });
                        } else {
                            filter.putSelectedOption(filter.getOption(optionValue));
                        }
                    }

                    function applyParams() {

                        if($routeParams.viewMode) {
                            angular.forEach(scope.viewModes, function(vm) {
                                if(vm.id === $routeParams.viewMode) {
                                    scope.viewMode = vm;
                                }
                            });
                        }

                        if($routeParams.orderProp) {
                            angular.forEach(scope.orderProps, function(op) {
                                if(op.id === $routeParams.orderProp) {
                                    scope.orderProp = op;
                                }
                            });
                        }

                        if($routeParams.orderDirection) {
                            scope.orderDirection = $routeParams.orderDirection;
                        }

                        if($routeParams.content) {
                            scope.content = $routeParams.content;
                        }

                        var filters = $routeParams.filters;
                        scope.filtersManager.resetFilter();

                        if(scope.preSelectedFilter) {
                            addSelectedOptionFilter(scope.preSelectedFilter, scope.type);
                            scope.filtersManager.addFilter(scope.preSelectedFilter);
                        }
                        
                        if(filters) {
                            var filtersO = angular.fromJson($routeParams.filters);
                            var facetedFilters = scope.filtersManager.getAvailabledFilters();

                            for(var paramName in filtersO) {

                                var i = 0;
                                for (i; i < facetedFilters.length; i++) {
                                    if (facetedFilters[i].getId() === paramName) {
                                        addOptionFilter(facetedFilters[i], filtersO[paramName]);
                                        addSelectedOptionFilter(facetedFilters[i], filtersO[paramName]);
                                        scope.filtersManager.addFilter(facetedFilters[i]);
                                    }
                               }
                            }
                            scope.facets = true;                     
                        } else {
                            scope.facets = false;
                        }

                        // scope.applyFilters();
                        var newQuery = scope.filtersManager.toQuery(scope.content);

                        if(scope.query !== newQuery) {
                            scope.query = newQuery;
                        }
                    }

                    scope.$on('$routeUpdate', function () {
                        applyParams();
                    });

                    // Scope variables
                    function initScopeVariables() {
                        scope.facets = false;
                        scope.lowFacets = false;
                    }

                    function init() {
                        initScopeVariables();

                        applyParams();
                    }
                    init();
                }
            }
        };
    }]);
