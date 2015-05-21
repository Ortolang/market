'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketToolbar
 * @description
 * # marketToolbar
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketToolbar', [ '$rootScope', '$routeParams', '$location',  function ($rootScope, $routeParams, $location) {
        return {
            restrict: 'E',
            scope: {
                type: '=',
                query: '=',
                items: '=',
                viewMode: '=',
                viewModes: '=',
                orderProp: '=',
                orderDirection: '=',
                orderProps: '=',
                filtersManager: '=',
                preSelectedFilter: '='
            },
            templateUrl: 'market/directives/market-toolbar.html',
            link: {
                post : function (scope) {
                
                    scope.search = function (content) {
                        if (content && content !== '') {
                            $rootScope.selectSearch();
                            $location.url('/search?content='+content+'&filters='+angular.toJson({'meta_ortolang-item-json.type':scope.type})+'&viewMode='+scope.viewMode.id);
                        }
                    };

                    scope.setFilter = function(filter, opt) {
                        if(filter.getSelected() && filter.getSelected().getValue() !== opt.getValue()) {
                            angular.forEach(filter.getSelected().getSubFilters(), function(subFilter) {
                                scope.filtersManager.removeFilter(subFilter);
                            });
                        }
                        scope.filtersManager.addFilter(filter, opt);
                        scope.applyFilters();
                    };

                    scope.removeFilter = function (filter) {
                        scope.filtersManager.removeFilter(filter);
                        scope.applyFilters();
                    };

                    scope.applyFilters = function() {
                        scope.hideLowFacets();

                        var content = '';
                        scope.query = scope.filtersManager.toQuery(content);
                        // setVisibleFilters();
                    }

                    scope.toggleOrderBy = function(orderProp){
                        if(scope.orderProp.id !== orderProp.id) {
                            scope.orderDirection = false;
                            scope.orderProp = orderProp;
                        } else {
                            scope.orderDirection = !scope.orderDirection;
                        }
                    };

                    // scope.switchViewMode = function() {
                    //     scope.viewMode = (scope.viewMode.id === viewModeLine.id) ? viewModeTile : viewModeLine;
                    // };

                    scope.setViewMode = function(view) {
                       scope.viewMode = view;
                    };

                    // function setVisibleFilters() {
                    //     scope.visibleFacets = [];

                        // angular.forEach(scope.filtersManager.getFilters(), function(filter) {
                            // $scope.visibleFacetedFilters.addFilter(filter);

                            // if(model[filter.getId()]) {
                            //     setSelectedOptionFilter(filter, model[filter.getId()]);
                            // }

                            // if(filter.getSelected()) {
                            //     angular.forEach(filter.getSelected().getSubFilters(), function(subFilter) {
                            //         scope.visibleFacets.push(subFilter);
                            //     });
                            // }
                        // });
                    // }

                    scope.hasAppliedFacets = function() {
                        var i = 0;
                        for (i; i < scope.filtersManager.getFilters().length; i++) {
                            if (scope.filtersManager.getFilters()[i].hasSelectedElement() && !scope.filtersManager.getFilters()[i].isLock()) {
                                return true;
                            }
                        }
                        return false;
                    };

                    scope.showLowFacets = function() {
                        scope.lowFacets = true;
                    };

                    scope.hideLowFacets = function() {
                        scope.lowFacets = false;
                    };

                    scope.showFacets = function() {
                        scope.facets = true;
                    };

                    scope.switchFacets = function() {
                        scope.facets = !scope.facets;
                    };

                    // Scope variables
                    function initScopeVariables() {

                        scope.facets = false;
                        scope.lowFacets = false;
                        // scope.visibleFacets = [];
                        // scope.orderProp = 'title';
                        // scope.orderDirection = false;
                        // scope.viewMode = viewModeTile;
                    }

                    function init() {
                        // initLocalVariables();
                        initScopeVariables();

                        if(scope.preSelectedFilter) {
                            scope.setFilter(scope.preSelectedFilter, scope.preSelectedFilter.getOption('Corpus'));
                        }
                    }
                    init();
                }
            }
        };
    }]);
