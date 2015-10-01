'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', ['Search', 'OptionFacetedFilter', 'Settings', function (Search, OptionFacetedFilter, Settings) {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                query: '=',
                filtersManager: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.Search = Search;

                function load(query) {
                    console.log('query : ' + query);
                    Search.search(query).$promise.then(function (results) {
                        if (scope.filtersManager) {
                            angular.forEach(scope.filtersManager.getAvailableFilters(), function (filter) {
                                filter.clearOptions();
                            });
                        }

                        angular.forEach(results, function (result) {
                            if (result.wskey) {
                                result.titleToSort = getTitleValue(result.title);

                                var itemFromManager = Search.getResult(result.wskey);
                                if (itemFromManager) {
                                    if (result.lastModificationDate > itemFromManager.lastModificationDate) {
                                        Search.removeResult(itemFromManager['@rid']);
                                    }
                                }
                            }

                        });

                        if (scope.filtersManager) {
                            angular.forEach(results, function (item) {
                                var i = 0;
                                for (i; i < scope.filtersManager.getAvailableFilters().length; i++) {
                                    if (item[scope.filtersManager.getAvailableFilters()[i].getAlias()]) {
                                        addOptionFilter(scope.filtersManager.getAvailableFilters()[i], item[scope.filtersManager.getAvailableFilters()[i].getAlias()]);
                                    }
                                }
                            });
                        }

                        Search.endProcessing();

                    });
                }

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

                function getTitleValue(multilingualTitle) {
                    var i;
                    for (i = 0; i < multilingualTitle.length; i++) {
                        if (multilingualTitle[i].lang === Settings.language) {
                            return multilingualTitle[i].value;
                        }
                    }
                    return multilingualTitle.length > 0 ? multilingualTitle[0].value : undefined;
                }

                scope.$watch('query', function () {
                    if (scope.query) {
                        load(scope.query);
                    }
                });
            }
        };
    }]);
