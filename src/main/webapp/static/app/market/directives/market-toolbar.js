'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketToolbar
 * @description
 * # marketToolbar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketToolbar', [ '$routeParams', '$location', '$analytics', 'OptionFacetedFilter', 'SearchResource', 'Helper',  function ($routeParams, $location, $analytics, OptionFacetedFilter, SearchResource, Helper) {
        return {
            restrict: 'EA',
            scope: {
                params: '=',
                search: '=',
                filtersManager: '=',
                preSelectedFilter: '=',
                searchPlaceHolder: '@',
                icons: '='
            },
            templateUrl: 'market/directives/market-toolbar.html',
            link: {
                post : function (scope) {

                    // scope.Search = Search;

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
                        $location.search(urlParam(scope.content, scope.search.activeViewMode, scope.search.activeOrderProp, (scope.search.orderReverse ? 'desc' : 'asc')));
                    };

                    scope.toggleOrderBy = function (orderProp) {
                        if (scope.search.activeOrderProp.id !== orderProp.id) {
                            scope.search.setActiveOrderProp(orderProp.id, false);
                        } else {
                            scope.search.setActiveOrderProp(orderProp.id, !scope.search.orderReverse);
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

                    /**
                     * Applys the search based on params from routeParams
                     **/
                    function applyParams() {

                        if ($routeParams.viewMode) {
                            scope.search.setActiveViewMode($routeParams.viewMode);
                            delete $routeParams.viewMode;
                        }
                        if ($routeParams.orderProp) {
                            scope.search.setActiveOrderProp($routeParams.orderProp, ($routeParams.orderDir === 'asc' ? false : true));
                            // delete $routeParams.orderProp;
                            // delete $routeParams.orderDir;
                        }
                        scope.content = $routeParams.content || undefined;
                        delete $routeParams.content;
                        var params = {};
                        if($routeParams.filters !== undefined) {
                            angular.copy(angular.fromJson($routeParams.filters), params);
                        }
                        if (scope.preSelectedFilter) {
                            params[scope.preSelectedFilter.getAlias()] = scope.preSelectedFilter.getSelectedOptions()[0].getValue();
                        }
                        params.content = scope.content || undefined;
                        params.fields = 'key,system-rating-json.score:rank,system-rating-json.esrAccessibility,ortolang-item-json.title,ortolang-item-json.type,ortolang-item-json.description,ortolang-item-json.image,ortolang-item-json.publicationDate,ortolang-workspace-json.wskey,ortolang-workspace-json.wsalias,ortolang-workspace-json.snapshotName';
                        params.orderProp = $routeParams.orderProp;
                        params.orderDir = $routeParams.orderDir;

                        // -- Sends params to search service (always watching params) --
                        scope.params = angular.toJson(params);


                        // -- Sets filters for HTML render view --

                        // Clears selection and remove all filters enabled
                        scope.filtersManager.resetFilter();
                        if (scope.preSelectedFilter) {
                            addSelectedOptionFilter(scope.preSelectedFilter, params[scope.preSelectedFilter.getAlias()]);
                            scope.filtersManager.addFilter(scope.preSelectedFilter);
                        }
                        var facetedFilters = scope.filtersManager.availabledFilters;

                        for (var paramName in params) {
                            if (params.hasOwnProperty(paramName) && params[paramName]) {
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

                    /**
                     * Returns an object containing all url param necessary to apply the criteria.
                     **/
                    function urlParam (content, viewMode, orderProp, orderDirection) {
                        var filters = {}, params = {};
                        angular.forEach(scope.filtersManager.enabledFilters, function (filter) {

                            if(!filter.isLocked()) {
                                var arrValue = [];
                                angular.forEach(filter.getSelectedOptions(), function (opt) {
                                    arrValue.push(opt.getValue());
                                });
                                filters[filter.id+'[]'] = arrValue;
                            }

                        });
                        params.filters = angular.toJson(filters);

                        if (content && content !== '') {
                            params.content = content;
                        }

                        params.viewMode = viewMode.id;
                        params.orderProp = orderProp.id;
                        params.orderDir = orderDirection;

                        return params;
                    }

                    /**
                     * Adds an option value to the filter.
                     **/
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

                    /**
                     * Adds an option value to the selection of the filter.
                     **/
                    function addSelectedOptionFilter(filter, optionValue) {
                        if (angular.isArray(optionValue)) {
                            angular.forEach(optionValue, function (opt) {
                                filter.putSelectedOption(filter.getOption(opt));
                            });
                        } else {
                            filter.putSelectedOption(filter.getOption(optionValue));
                        }
                    }


                    /**
                     * Sets options values of all filters availabled.
                     **/
                    function setOptionsFilters() {
                        var facetedFilters = scope.filtersManager.availabledFilters,
                            i = 0;
                        for (i; i < facetedFilters.length; i++) {
                            if (facetedFilters[i] !== scope.preSelectedFilter) {
                                setOptionsFilter(facetedFilters[i]);
                            }
                        }
                    }

                    /**
                     * Sets options values for a filter by sending a request to the server.
                     **/
                    function setOptionsFilter(filter) {
                        var alias = filter.getAlias();
                        var params = scope.params !== undefined ? angular.fromJson(scope.params) : {};
                        params.fields = 'ortolang-item-json.'+filter.getAlias() + ':' + alias;
                        params.group = 'ortolang-item-json.'+alias;

                        SearchResource.findCollections(params, function(results) {
                            angular.forEach(results, function(result) {
                                if(angular.isDefined(result[alias])) {
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

                    /**
                     * Each time the results change, the option values of each filters are updated.
                     **/
                    scope.$watch('search.results', function () {
                        if(scope.search && scope.search.results !== null) {
                            setOptionsFilters();
                        }
                    });

                    /**
                     * Applies criteria each time the route (url param) changed.
                     **/
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
