'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketToolbar
 * @description
 * # marketToolbar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketToolbar', [ '$routeParams', '$location', '$analytics', 'OptionFacetedFilter', 'Search', 'MetadataResource', 'Helper',  function ($routeParams, $location, $analytics, OptionFacetedFilter, Search, MetadataResource, Helper) {
        return {
            restrict: 'EA',
            scope: {
                params: '=',
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

                        $location.search(scope.filtersManager.urlParam(scope.content, Search.activeViewMode, Search.activeOrderProp, Search.orderReverse));
                        // scope.query = scope.filtersManager.toQuery(scope.content);
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
                                if(!filter.getOption(opt)) {
                                    filter.putOption(OptionFacetedFilter.make({
                                        // label: opt,
                                        value: opt,
                                        length: 1
                                    }));
                                }
                            });
                        } else {
                            if(!filter.getOption(optionValue)) {
                                filter.putOption(OptionFacetedFilter.make({
                                    // label: optionValue,
                                    value: optionValue,
                                    length: 1
                                }));
                            }
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

                        var params = {};
                        if($routeParams.filters !== undefined) {
                            angular.copy(angular.fromJson($routeParams.filters), params);
                        }

                        if (scope.preSelectedFilter) {
                            params[scope.preSelectedFilter.getAlias()] = scope.preSelectedFilter.getSelectedOptions()[0].getValue();
                        }

                        params.content = scope.content || undefined;

                        scope.params = angular.toJson(params);
                        

                        scope.filtersManager.resetFilter();

                        if (scope.preSelectedFilter) {
                            addSelectedOptionFilter(scope.preSelectedFilter, params[scope.preSelectedFilter.getAlias()]);
                            scope.filtersManager.addFilter(scope.preSelectedFilter);
                        }

                        if ($routeParams.filters && $routeParams.filters !== '{}') {
                            var facetedFilters = scope.filtersManager.availabledFilters;

                            for (var paramName in params) {
                                if (params.hasOwnProperty(paramName)) {
                                    var paramKey = paramName;
                                    if(Helper.endsWith(paramKey, '[]')) {
                                        paramKey = paramKey.substring(0, paramKey.length-2);
                                    }
                                    var i = 0;
                                    for (i; i < facetedFilters.length; i++) {
                                        if (facetedFilters[i].getId() === paramKey) {
                                            addOptionFilter(facetedFilters[i], params[paramName]);
                                            addSelectedOptionFilter(facetedFilters[i], params[paramName]);
                                            scope.filtersManager.addFilter(facetedFilters[i]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    function setOptionsFilters() {

                        var facetedFilters = scope.filtersManager.availabledFilters,
                            i = 0;
                        for (i; i < facetedFilters.length; i++) {
                            if (facetedFilters[i] !== scope.preSelectedFilter) {
                                setOptionsFilter(facetedFilters[i]);
                            }
                        }
                    }

                    function setOptionsFilter(filter) {
                        // type=Corpus&fields=statusOfUse:status&group=statusOfUse.key
                        var alias = filter.getAlias();
                        var params = scope.params !== undefined ? angular.fromJson(scope.params) : {};
                        params.fields = filter.getAlias() + ':' + alias;
                        params.group = alias;

                        MetadataResource.listCollections(params, function(results) {
                            angular.forEach(results, function(result) {
                                if(angular.isDefined(result[alias])) {
                                    //TODO Use WIND Orientdb ?
                                    if(angular.isArray(result[alias])) {
                                        angular.forEach(result[alias], function (field) {
                                            var label = Helper.getMultilingualValue(field['meta_ortolang-referential-json'].labels);
                                            if(!filter.getOption(label)) {
                                                filter.putOption(OptionFacetedFilter.make({
                                                    label: label,
                                                    value: field.key,
                                                    length: 1
                                                }));
                                            }
                                        });
                                    } else {
                                        var label = Helper.getMultilingualValue(result[alias]['meta_ortolang-referential-json'].labels);
                                        if(!filter.getOption(label)) {
                                            filter.putOption(OptionFacetedFilter.make({
                                                label: label,
                                                value: result[alias].key,
                                                length: 1
                                            }));
                                        }
                                    }
                                }
                            });
                        });
                    }

                    scope.$on('$routeUpdate', function () {
                        applyParams();
                    });

                    scope.$watch('Search.results', function () {
                        if(Search.results !== null) {
                            setOptionsFilters();
                        }
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
