'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:facetFilterSearchBar
 * @description
 * # facetFilterSearchBar
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('facetFilterSearchBar', {
        bindings: {
            search: '=',
            filtersManager: '='
        },
        controller: ['$location', '$routeParams', '$scope', 'icons', 'Helper', 'OptionFacetedFilter', 'Suggester', 
            function ($location, $routeParams, $scope, icons, Helper, OptionFacetedFilter, Suggester) {
            var ctrl = this, subscription, fireSearchFromFacet, fireSearchFromURL;

            /**
             * Returns an object containing all url param necessary to apply the criteria.
             **/
            function urlParam(content, viewMode, orderProp, orderDirection) {
                var filters = {}, params = {};
                angular.forEach(ctrl.filtersManager.enabledFilters, function (filter) {
                    if (!filter.isLocked()) {
                        var arrValue = [];
                        angular.forEach(filter.getSelectedOptions(), function (opt) {
                            arrValue.push(opt.getValue());
                        });
                        if (filter.getType() === 'array') {
                            filters[filter.id + '[]'] = arrValue;
                        } else {
                            filters[filter.id] = arrValue;
                        }
                    }
                });
                params.filters = angular.toJson(filters);
                if (content) {
                    params.content = content;
                }
                params.viewMode = viewMode.id;
                params.orderProp = orderProp.id;
                params.orderDir = orderDirection;
                return params;
            }

            /**
             * Executes the query via SearchProvider.
             */
            function executeQuery(content, viewMode, orderProp, orderDirection) {
                var params = {};
                if (viewMode) {
                    ctrl.search.setActiveViewMode(viewMode);
                }
                if (orderProp) {
                    ctrl.search.setActiveOrderProp(orderProp, (orderDirection !== 'asc'));
                }
                // Content
                params['_all*'] = content || undefined;
                // Filters
                if (ctrl.filtersManager.enabledFilters.length > 0) {
                    angular.forEach(ctrl.filtersManager.enabledFilters, function (filter) {
                        if (!filter.isLocked()) {
                            var arrValue = [];
                            angular.forEach(filter.getSelectedOptions(), function (opt) {
                                arrValue.push(opt.getValue());
                            });
                            if (filter.getType() === 'array') {
                                params[filter.id + '[]'] = arrValue;
                            } else {
                                params[filter.id] = arrValue;
                            }
                        }
                    });
                }
                // Aggregations (Facets)
                var facetedFilters = ctrl.filtersManager.availabledFilters;
                if (facetedFilters.length > 0) {
                    params.aggregations = [];
                    angular.forEach(facetedFilters, function (facet) {
                        if (facet.getType() === 'array') {
                            params.aggregations.push(facet.getAlias() + '[]:' + facet.getAlias() + '.content');
                        } else {
                            if (facet.getAlias() == 'type') {
                                params.aggregations.push(facet.getAlias() + ':' + facet.getAlias());
                            } else {
                                params.aggregations.push(facet.getAlias() + ':' + facet.getAlias() + '.content');
                            }
                        }
                    });
                }
                params.archive = false;
                ctrl.search.search(params);
            }
            
            ctrl.applyFilters = function () {
                // Changes the URL
                if (!fireSearchFromURL) {
                    fireSearchFromFacet = true;
                    $location.search(urlParam(ctrl.content, ctrl.search.activeViewMode, ctrl.search.activeOrderProp, (ctrl.search.orderReverse ? 'desc' : 'asc')));
                }
                // Executes the query via SearchProvider 
                executeQuery(ctrl.content, ctrl.search.activeViewMode, ctrl.search.activeOrderProp, (ctrl.search.orderReverse ? 'desc' : 'asc'));
                fireSearchFromURL = false;
            };

            ctrl.toggleOrderBy = function (orderProp) {
                if (ctrl.search.activeOrderProp.id !== orderProp.id) {
                    ctrl.search.setActiveOrderProp(orderProp.id, false);
                } else {
                    ctrl.search.setActiveOrderProp(orderProp.id, !ctrl.search.orderReverse);
                }
                // Update the URL param
                $location.search(urlParam(ctrl.content, ctrl.search.activeViewMode, ctrl.search.activeOrderProp, (ctrl.search.orderReverse ? 'desc' : 'asc')));
            };

            function onEnabledFilterChange() {
                ctrl.applyFilters();
            }

            /**
             * Adds an option value to the filter.
             **/
            function addOptionFilter(filter, optionValue) {
                if (angular.isArray(optionValue)) {
                    angular.forEach(optionValue, function (opt) {
                        if (!filter.getOption(opt)) {
                            filter.putOption(OptionFacetedFilter.make({
                                value: opt,
                                length: 1
                            }));
                        }
                    });
                } else {
                    if (!filter.getOption(optionValue)) {
                        filter.putOption(OptionFacetedFilter.make({
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
             * Sets filters GUI from route params.
             */
            function setEnabledFiltersFromRouteParam(urlParam) {
                var routeParamsfilters = angular.fromJson(urlParam || $routeParams.filters);
                ctrl.filtersManager.resetEnabledFilters();
                for (var paramName in routeParamsfilters) {
                    if (routeParamsfilters.hasOwnProperty(paramName) && routeParamsfilters[paramName]) {
                        var paramKey = paramName;
                        if (Helper.endsWith(paramKey, '[]')) {
                            paramKey = paramKey.substring(0, paramKey.length - 2);
                        }
                        var facetedFilters = ctrl.filtersManager.availabledFilters;
                        if (facetedFilters.length > 0) {
                            var i = 0;
                            for (i; i < facetedFilters.length; i++) {
                                if (facetedFilters[i].getId() === paramKey) {
                                    addOptionFilter(facetedFilters[i], routeParamsfilters[paramName]);
                                    addSelectedOptionFilter(facetedFilters[i], routeParamsfilters[paramName]);
                                    ctrl.filtersManager.addEnabledFilter(facetedFilters[i]);
                                    break;
                                }
                            }
                        }
                    }
                }
                ctrl.filtersManager.applyFilters();
            }

            ctrl.suggest = Suggester.suggest;

            ctrl.applySuggestion = function () {
                Suggester.goToSearch(ctrl.content);
                //TODO remove filter URL parameter
                $scope.$apply();
            };
            
            $scope.$on('$routeUpdate', function ($event, next, current) {
                if (!fireSearchFromFacet) {
                    fireSearchFromURL = true;
                    // Runs search at startup
                    ctrl.content = next.params.content || '';
                    // Sets filters
                    if (angular.isDefined(next.params.filters)) {
                        setEnabledFiltersFromRouteParam(next.params.filters);
                    }
                }
                // Limit of one search per request
                fireSearchFromFacet = false;
            });

            ctrl.$onInit = function () {
                ctrl.icons = icons;
                subscription = ctrl.filtersManager.onEnabledFilterChange(onEnabledFilterChange);
                fireSearchFromFacet = false;
                fireSearchFromURL = true;
                // Runs search at startup
                ctrl.content = $routeParams.content || '';
                // Sets filters
                if (angular.isDefined($routeParams.filters)) {
                    setEnabledFiltersFromRouteParam();
                }
            };

            ctrl.$onDestroy = function () {
                subscription.dispose();
            };
        }],
        templateUrl: 'market/components/facet-filter-search-bar.component.html'
    });
