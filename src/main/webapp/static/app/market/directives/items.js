'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', [ '$rootScope', '$routeParams', 'icons', 'JsonResultResource', 'OptionFacetedFilter', 'ItemManager',  function ($rootScope, $routeParams, icons, JsonResultResource, OptionFacetedFilter, ItemManager) {
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
                    scope.lock = true;
                    JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {

                        scope.items.clear();
                        if(scope.filtersManager) {
                            angular.forEach(scope.filtersManager.getAvailabledFilters(), function(filter) {
                                filter.clearOptions();
                            });
                        }

                        angular.forEach(jsonResults, function(jsonResult) {
                            var jsEntry = angular.fromJson(jsonResult);
                            if(jsEntry.title) {

                                scope.items.addItem(jsEntry);


                                if(scope.filtersManager) {
                                    var i = 0;
                                    for (i; i < scope.filtersManager.getAvailabledFilters().length; i++) {
                                        if (jsEntry[scope.filtersManager.getAvailabledFilters()[i].getAlias()]) {
                                            addOptionFilter(scope.filtersManager.getAvailabledFilters()[i], jsEntry[scope.filtersManager.getAvailabledFilters()[i].getAlias()]);
                                        }
                                    }
                                }
                            }

                        });

                        scope.lock = false;
                    }, function (reason) {
                        console.error(reason);
                        scope.lock = false;
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
                    if(scope.query!==undefined && scope.query !== '') {
                        load(scope.query);
                    }
                });

                function init() {
                    scope.lock = false;
                    if(scope.query !== '' && scope.loadAtStartup) {
                        load(scope.query);
                    }
                    if(!scope.items) {
                        scope.items = ItemManager.make();
                    }
                }
                init();
            }
        };
    }]);
