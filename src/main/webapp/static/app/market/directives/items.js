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
                type: '=',
                content: '=',
                query: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.Search = Search;

                scope.$on('$destroy', function () {
                    Search.clearResults();
                });

                function load() {
                    var param = {};
                    if (scope.type) {
                        param.type = scope.type;
                    }
                    if (scope.newContent) {
                        param.content = scope.newContent;
                    }
                    Search.search(param).$promise.then(function (results) {
                        angular.forEach(results, function (result) {
                            if (result['meta_ortolang-workspace-json'] && result['meta_ortolang-workspace-json'].wskey) {
                                var title = result['meta_ortolang-item-json'].title;
                                result.effectiveTitle = Helper.getMultilingualValue(title);

                                var itemFromManager = Search.getResult(result['meta_ortolang-workspace-json'].wskey);
                                if (itemFromManager && result.lastModificationDate > itemFromManager.lastModificationDate) {
                                    Search.removeResult(itemFromManager.key);
                                }
                            }
                        });

                        Search.endProcessing();
                    });
                }


                // Scope variables
                function initScopeVariables() {
                    scope.newContent = undefined;
                }
                initScopeVariables();

                scope.$watch('type', function () {
                    load();
                });
                scope.$watch('content', function () {
                    if (scope.content !== scope.newContent) {
                        scope.newContent = scope.content;
                        load();
                    }
                });
            }
        };
    }]);
