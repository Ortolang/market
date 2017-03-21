'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', ['$location', 'SearchProvider', 'Helper', function ($location, SearchProvider, Helper) {
        return {
            restrict: 'A',
            scope: {
                title: '=',
                params: '=',
                search: '=',
                inline: '=',
                subtitleValue: '=',
                seeMore: '=?',
                seeMoreValue: '@?',
                emptyLabel: '@?',
                noEmptyLabel: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.$on('$destroy', function () {
                    scope.search.clearResults();
                });

                function load() {
                    var param = angular.fromJson(scope.newParams);
                    scope.search.search(param).$promise.then(function (results) {
                        if (angular.isDefined(scope.seeMoreValue)) {
                            scope.count = results.totalHits;
                        }
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
                    scope.count = 0;
                    scope.subtitle = scope.subtitleValue ? scope.subtitleValue : 'MARKET.RESOURCES';
                    if (!scope.search) {
                        scope.search = SearchProvider.make();
                    }
                }
                initScopeVariables();
            }
        };
    }]);
