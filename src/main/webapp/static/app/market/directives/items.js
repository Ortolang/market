'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', ['Search', 'OptionFacetedFilter', 'Settings', 'Helper', function (Search, OptionFacetedFilter, Settings, Helper) {
        return {
            restrict: 'A',
            scope: {
                title: '=',
                params: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.Search = Search;

                scope.$on('$destroy', function () {
                    Search.clearResults();
                });

                function load() {
                    var param = angular.fromJson(scope.newParams);
                    Search.search(param).$promise.then(function (results) {
                        angular.forEach(results, function (result) {
                            if (result['meta_ortolang-workspace-json'] && result['meta_ortolang-workspace-json'].wskey) {
                                var title = result['meta_ortolang-item-json'].title;
                                result.effectiveTitle = Helper.getMultilingualValue(title);

                                var itemFromManager = Search.getResult(result['meta_ortolang-workspace-json'].wskey);
                                if (itemFromManager && result.lastModificationDate > itemFromManager.lastModificationDate) {
                                    Search.removeResult(itemFromManager.key);
                                }
                                
                                var publicationDate = result['meta_ortolang-item-json'].publicationDate;
                                result.publicationDate = publicationDate;
                            }
                        });

                        Search.endProcessing();
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
                }
                initScopeVariables();
            }
        };
    }]);
