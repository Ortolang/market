'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketToolbar
 * @description
 * # marketToolbar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketToolbar', [ '$routeParams', '$location', '$analytics', 'OptionFacetedFilter', 'Search',  function ($routeParams, $location, $analytics, OptionFacetedFilter, Search) {
        return {
            restrict: 'EA',
            scope: {
                type: '=',
                query: '=',
                filtersManager: '=',
                preSelectedFilter: '=',
                searchPlaceHolder: '@',
                icons: '='
            },
            templateUrl: 'market/directives/market-toolbar.html',
            link: {
                post : function (scope) {

                    scope.Search = Search;

                    scope.setFilter = function (filter, opt) {
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

                        if (apply) {
                            scope.applyFilters();
                        }
                    };

                    scope.removeFilter = function (filter) {
                        if (filter.hasSelectedOptions()) {
                            scope.filtersManager.removeFilter(filter);
                            scope.applyFilters();
                        }
                    };

                    scope.resetFilters = function () {
                        scope.filtersManager.resetFilter();
                        scope.applyFilters();
                    };

                    scope.applyFilters = function () {
                        scope.hideLowFacets();
                        //if (scope.content !== $location.search().content) {
                        //    var content = scope.filtersManager.toAnalytics(scope.content);
                        //    $analytics.trackSiteSearch(content, scope.type);
                        //}

                        $location.search(scope.filtersManager.urlParam(scope.content, Search.activeViewMode, Search.activeOrderProp, Search.orderReverse, scope.facets));
                        scope.query = scope.filtersManager.toQuery(scope.content);
                    };

                    scope.toggleOrderBy = function (orderProp) {
                        if (Search.activeOrderProp.id !== orderProp.id) {
                            Search.setActiveOrderProp(orderProp.id, false);
                        } else {
                            Search.setActiveOrderProp(orderProp.id, !Search.orderReverse);
                        }
                    };

                    scope.hasAppliedFacets = function () {
                        var i = 0;
                        for (i; i < scope.filtersManager.enabledFilters.length; i++) {
                            if (scope.filtersManager.enabledFilters[i].hasSelectedOptions() && !scope.filtersManager.enabledFilters[i].isLocked()) {
                                return true;
                            }
                        }
                        return false;
                    };

                    scope.hasLowFacets = function () {
                        var i = 0;
                        for (i; i < scope.filtersManager.availabledFilters.length; i++) {
                            if (scope.filtersManager.availabledFilters[i].getPriority() !== 'high' &&
                                !scope.filtersManager.availabledFilters[i].isLocked() &&
                                scope.filtersManager.availabledFilters[i].isVisible()) {
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

                    function addOptionFilter(filter, optionValue) {
                        if (angular.isArray(optionValue)) {
                            angular.forEach(optionValue, function (opt) {
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

                    function addSelectedOptionFilter(filter, optionValue) {
                        if (angular.isArray(optionValue)) {
                            angular.forEach(optionValue, function (opt) {
                                filter.putSelectedOption(filter.getOption(opt));
                            });
                        } else {
                            filter.putSelectedOption(filter.getOption(optionValue));
                        }
                    }

                    function applyParams() {

                        if ($routeParams.viewMode) {
                            Search.setActiveViewMode($routeParams.viewMode);
                        }

                        if ($routeParams.orderProp) {
                            Search.setActiveOrderProp($routeParams.orderProp, $routeParams.orderDirection);
                        }

                        scope.content = $routeParams.content || undefined;

                        var filters = $routeParams.filters;
                        scope.filtersManager.resetFilter();

                        if (scope.preSelectedFilter) {
                            addSelectedOptionFilter(scope.preSelectedFilter, scope.type);
                            scope.filtersManager.addFilter(scope.preSelectedFilter);
                        }

                        if (filters) {
                            var filtersO = angular.fromJson($routeParams.filters),
                                facetedFilters = scope.filtersManager.availabledFilters;

                            for (var paramName in filtersO) {
                                if (filtersO.hasOwnProperty(paramName)) {
                                    var i = 0;
                                    for (i; i < facetedFilters.length; i++) {
                                        if (facetedFilters[i].getId() === paramName) {
                                            addOptionFilter(facetedFilters[i], filtersO[paramName]);
                                            addSelectedOptionFilter(facetedFilters[i], filtersO[paramName]);
                                            scope.filtersManager.addFilter(facetedFilters[i]);
                                        }
                                    }
                                }
                            }
                            // scope.facets = true;
                        } else {
                            scope.facets = false;
                        }

                        if ($routeParams.facets) {
                            scope.facets = ($routeParams.facets === 'true');
                        }

                        var newQuery = scope.filtersManager.toQuery(scope.content);

                        if (scope.query !== newQuery) {
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
