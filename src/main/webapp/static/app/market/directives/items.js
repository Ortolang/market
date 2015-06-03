'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', [ '$rootScope', '$routeParams', 'icons', 'JsonResultResource', 'OptionFacetedFilter',  function ($rootScope, $routeParams, icons, JsonResultResource, OptionFacetedFilter) {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                query: '=',
                items: '=',
                viewMode: '=',
                viewModes: '=',
                orderProp: '=',
                orderProps: '=',
                orderDirection: '=',
                filtersManager: '=',
                loadAtStartup: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {
                
                function load (query) {
                    console.log('query : ' + query);
                    JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                        // scope.items = [];
                        scope.items.clear();
                        angular.forEach(scope.filtersManager.getAvailabledFilters(), function(filter) {
                            filter.clearOptions();
                        });

                        angular.forEach(jsonResults, function(jsonResult) {
                            var jsEntry = angular.fromJson(jsonResult);
                            scope.items.addItem(jsEntry);

                            var i = 0;
                            for (i; i < scope.filtersManager.getAvailabledFilters().length; i++) {
                                if (jsEntry[scope.filtersManager.getAvailabledFilters()[i].getAlias()]) {
                                    addOptionFilter(scope.filtersManager.getAvailabledFilters()[i], jsEntry[scope.filtersManager.getAvailabledFilters()[i].getAlias()]);
                                }
                            }

                        });
                    }, function (reason) {
                        console.error(reason);
                    });
                }

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

                scope.$watch('query', function () {
                    if(scope.query!==undefined) {
                        load(scope.query);
                    }
                });

                function init() {

                    if(scope.query !== '' && scope.loadAtStartup) {
                        load(scope.query);
                    }
                }
                init();
            }
        };
    }]);
