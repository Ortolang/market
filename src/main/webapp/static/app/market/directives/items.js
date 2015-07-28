'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', ['JsonResultResource', 'OptionFacetedFilter', 'ItemManager',  function (JsonResultResource, OptionFacetedFilter, ItemManager) {
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

                function load(query) {
                    console.log('query : ' + query);
                    scope.lock = true;
                    JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {

                        scope.items.clear();
                        if (scope.filtersManager) {
                            angular.forEach(scope.filtersManager.getAvailableFilters(), function (filter) {
                                filter.clearOptions();
                            });
                        }

                        angular.forEach(jsonResults, function(jsonResult) {
                            var jsEntry = angular.fromJson(jsonResult);

                            if (jsEntry.wskey) {
                                var itemFromManager = scope.items.getItem(jsEntry.wskey);
                                if (itemFromManager) {
                                    var entryVersionDate = jsEntry.lastModificationDate,
                                        managerVersionDate = itemFromManager.lastModificationDate;

                                    if (entryVersionDate > managerVersionDate) {
                                        scope.items.setItem(itemFromManager, jsEntry);
                                    }
                                } else {
                                    scope.items.addItem(jsEntry);
                                }

                            }

                        });

                        if (scope.filtersManager) {
                            angular.forEach(scope.items.getItems(), function(item) {
                                var i = 0;
                                for (i; i < scope.filtersManager.getAvailableFilters().length; i++) {
                                    if (item[scope.filtersManager.getAvailableFilters()[i].getAlias()]) {
                                        addOptionFilter(scope.filtersManager.getAvailableFilters()[i], item[scope.filtersManager.getAvailableFilters()[i].getAlias()]);
                                    }
                                }
                            });
                        }

                        scope.lock = false;
                    }, function (reason) {
                        console.error(reason);
                        scope.lock = false;
                    });
                }

                function addOptionFilter(filter, optionValue) {
                    if (angular.isArray(optionValue)) {
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
                    if (scope.query !== undefined && scope.query !== '') {
                        load(scope.query);
                    }
                });

                function init() {
                    scope.lock = false;
                    if (scope.query !== '' && scope.loadAtStartup) {
                        load(scope.query);
                    }
                    if (!scope.items) {
                        scope.items = ItemManager.make();
                    }
                }
                init();
            }
        };
    }]);
