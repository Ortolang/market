'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', ['SearchProvider', 'OptionFacetedFilter', 'Settings', 'Helper', function (SearchProvider, OptionFacetedFilter, Settings, Helper) {
        return {
            restrict: 'A',
            scope: {
                title: '=',
                params: '=',
                search: '=',
                inline: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.$on('$destroy', function () {
                    scope.search.clearResults();
                });

                function load() {
                    var param = angular.fromJson(scope.newParams);
                    scope.search.search(param).$promise.then(function (results) {
                        scope.search.pack();

                        angular.forEach(results, function (result) {
                            if (result['meta_ortolang-workspace-json'] && result['meta_ortolang-workspace-json'].wskey) {
                                var title = result['meta_ortolang-item-json'].title;
                                result.effectiveTitle = Helper.getMultilingualValue(title);

                                var publicationDate = result['meta_ortolang-item-json'].publicationDate;
                                result.publicationDate = publicationDate;
                            }
                        });

                        scope.search.endProcessing();
                    });
                }

                scope.$watch('params', function () {
                    if (scope.params !== undefined && scope.params !== scope.newParams) {
                        scope.newParams = scope.params;
                        load();
                    }
                });

                // Scope variables
                function initScopeVariables() {
                    scope.newContent = undefined;
                    scope.newParams = undefined;
                    if (!scope.search) {
                        scope.search = SearchProvider.make();
                    }
                }
                initScopeVariables();
            }
        };
    }]);
