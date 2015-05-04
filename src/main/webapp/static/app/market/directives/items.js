'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', [ '$rootScope', '$routeParams', '$location', 'JsonResultResource', 'QueryBuilderService',  function ($rootScope, $routeParams, $location, JsonResultResource, QueryBuilderService) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {
                
                scope.search = function (content) {
                    if (content && content !== '') {
                        $rootScope.selectSearch();
                        $location.url('/search?content='+content+'&filters='+angular.toJson({'meta_ortolang-item-json.type':scope.type}));
                    }
                };

                function load () {
                    var queryBuilder = QueryBuilderService.make({
                        projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl', 
                        source: 'collection'
                    });

                    queryBuilder.equals('status', 'published');
                    queryBuilder.and();
                    queryBuilder.equals('meta_ortolang-item-json.type', scope.type);

                    var query = queryBuilder.toString();
                    console.log('query : ' + query);
                    JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                        angular.forEach(jsonResults, function(jsonResult) {
                            var jsEntry = angular.fromJson(jsonResult);
                            scope.items.push(jsEntry);
                        });
                    }, function (reason) {
                        console.error(reason);
                    });
                }

                // Scope variables
                function initScopeVariables() {
                    scope.items = [];
                }

                function init() {
                    initScopeVariables();

                    load();
                }
                init();
            }
        };
    }]);
