'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$scope', '$routeParams', '$translate', '$location', '$route', '$filter', 'SearchResource', 'QueryBuilderFactory', 'MarketBrowserService', function ($scope, $routeParams, $translate, $location, $route, $filter, SearchResource, QueryBuilderFactory, MarketBrowserService) {

        function loadItem() {

            var queryBuilder = QueryBuilderFactory.make({projection: '*, meta_ortolang-workspace-json.snapshotName as snapshotName, meta_ortolang-workspace-json.wskey as wskey, meta_ortolang-item-json.type as type', source: 'collection'});
            queryBuilder.equals('status', 'published').and().equals('meta_ortolang-workspace-json.wsalias', $scope.itemAlias);

            console.log(queryBuilder.toString());
            SearchResource.json({query: queryBuilder.toString()}, function (results) {
                if (results.length >= 1) {
                    if (!/^(corpora|lexicons|applications|tools)$/.test($routeParams.section)) {
                        switch (results[results.length - 1].type) {
                            case 'Corpus':
                                $route.updateParams({section: 'corpora'});
                                return;
                            case 'Lexique':
                                $route.updateParams({section: 'lexicons'});
                                return;
                            case 'Application':
                                $route.updateParams({section: 'applications'});
                                return;
                            case 'Outil':
                                $route.updateParams({section: 'tools'});
                                return;
                        }
                    }

                    queryBuilder = QueryBuilderFactory.make({projection: '*, meta_ortolang-workspace-json.wskey as wskey, meta_ortolang-workspace-json.wsalias as wsalias, meta_ortolang-workspace-json.tags as tags', source: 'workspace'});
                    queryBuilder.equals('meta_ortolang-workspace-json.wsalias', $scope.itemAlias);
                    SearchResource.json({query: queryBuilder.toString()}, function (workspace) {

                        if (workspace.length === 1) {
                            var filteredResult;
                            workspace = workspace[0];

                            $scope.tags = $filter('orderBy')(workspace.tags, function (tag) {
                                return tag.name;
                            });

                            if ($routeParams.version) {
                                var filteredTag = $filter('filter')($scope.tags, {name: $routeParams.version});
                                if (filteredTag.length === 1) {
                                    $scope.tag = filteredTag[0];
                                }
                            }
                            if (!$scope.tag) {
                                $scope.tag = $scope.tags[$scope.tags.length - 1];
                            }
                            filteredResult = $filter('filter')(results, {snapshotName:  $scope.tag.snapshot});
                            $scope.ortolangObject = filteredResult[0];

                            MarketBrowserService.workspace = {alias: $scope.itemAlias, key: workspace.wskey};
                            $scope.root = $scope.ortolangObject.snapshotName;
                            $scope.itemKey = $scope.ortolangObject.key;

                            var queryOrtolangMeta = 'SELECT FROM ' + $scope.ortolangObject['meta_ortolang-item-json'];
                            SearchResource.json({query: queryOrtolangMeta}, function (jsonObject) {
                                $scope.item = jsonObject[0];
                                $scope.ready = true;
                            });

                        }

                    });

                }
            });
        }

        function init() {
            $scope.itemAlias = $routeParams.alias;
            $scope.browse = $location.search().browse;
            $scope.ready = false;
            $scope.item = {};
            loadItem();
        }

        init();

    }]);
