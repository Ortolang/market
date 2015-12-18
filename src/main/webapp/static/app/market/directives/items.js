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
            restrict: 'A',
            scope: {
                title: '=',
                query: '=',
                filtersManager: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {

                scope.Search = Search;

                scope.$on('$destroy', function () {
                    Search.clearResults();
                });

                function load(query) {
                    //console.log('query : ' + query);
                    Search.search(query).$promise.then(function (results) {

                        angular.forEach(results, function (result) {
                            if (result.wskey) {
                                result.effectiveTitle = getTitleValue(result.title);
                                var itemFromManager = Search.getResult(result.wskey);
                                if (itemFromManager && result.lastModificationDate > itemFromManager.lastModificationDate) {
                                    Search.removeResult(itemFromManager['@rid']);
                                }
                            }
                        });

                        Search.endProcessing();
                    });
                }

                function getTitleValue(multilingualTitle) {
                    if (!multilingualTitle) {
                        return null;
                    }
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
