'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:items
 * @description
 * # items
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('items', [ '$rootScope', '$routeParams', '$location', 'icons', 'JsonResultResource', 'QueryBuilderService',  function ($rootScope, $routeParams, $location, icons, JsonResultResource, QueryBuilderService) {
        return {
            restrict: 'E',
            scope: {
                type: '='
            },
            templateUrl: 'market/directives/items.html',
            link: function (scope) {
                
                var viewModeLine, viewModeTile;

                scope.search = function (content) {
                    if (content && content !== '') {
                        $rootScope.selectSearch();
                        $location.url('/search?content='+content+'&filters='+angular.toJson({'meta_ortolang-item-json.type':scope.type})+'&viewMode='+scope.viewMode.id);
                    }
                };

                scope.toggleOrderBy = function(orderProp){
                    if(scope.orderProp !== orderProp) {
                        scope.orderDirection = false;
                        scope.orderProp = orderProp;
                    } else {
                        scope.orderDirection = !scope.orderDirection;
                    }
                };

                scope.switchViewMode = function() {
                    scope.viewMode = (scope.viewMode.id === viewModeLine.id) ? viewModeTile : viewModeLine;
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

                function setViewMode(id) {
                    if(id === viewModeLine.id) {
                        scope.viewMode = viewModeLine;
                    } else if(id === viewModeTile.id) {
                        scope.viewMode = viewModeTile;
                    }
                }

                function initLocalVariables() {
                    viewModeLine = {id: 'line', icon: icons.browser.viewModeTile, text: 'BROWSER.VIEW_MODE_TILE'};
                    viewModeTile = {id: 'tile', icon: icons.browser.viewModeLine, text: 'BROWSER.VIEW_MODE_LINE'};
                }

                // Scope variables
                function initScopeVariables() {
                    scope.items = [];

                    scope.orderProp = 'title';
                    scope.orderDirection = false;
                    scope.viewMode = viewModeTile;
                }

                function init() {
                    initLocalVariables();
                    initScopeVariables();

                    load();
                }
                init();
            }
        };
    }]);
