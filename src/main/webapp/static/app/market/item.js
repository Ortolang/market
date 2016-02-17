'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ItemCtrl', ['$scope', '$routeParams', '$translate', '$location', '$route', '$filter', 'MetadataResource', 'MarketBrowserService', function ($scope, $routeParams, $translate, $location, $route, $filter, MetadataResource, MarketBrowserService) {

        function loadItem() {
        	MetadataResource.getWorkspace({alias: $scope.itemAlias}, function (workspace) {
        		workspace =  workspace['meta_ortolang-workspace-json'];
                $scope.tags = $filter('orderBy')(workspace.tags, function (tag) {
                    return tag.name;
                });

                if ($routeParams.version) {
                    var filteredTag = $filter('filter')($scope.tags, {name: $routeParams.version}, true);
                    if (filteredTag.length === 1) {
                        $scope.tag = filteredTag[0];
                    }
                }
                if (!$scope.tag) {
                    $scope.tag = $scope.tags[$scope.tags.length - 1];
                }

                MarketBrowserService.workspace = {alias: $scope.itemAlias, key: workspace.wskey};

                MetadataResource.getCollection({key: $scope.tag.key}, function (collection) {
                	$scope.ortolangObject = collection;
                	$scope.root = $scope.tag.snapshot;
                    $scope.itemKey = collection.key;
                    $scope.item = collection['meta_ortolang-item-json'];

                    if (!/^(corpora|lexicons|applications|tools)$/.test($routeParams.section)) {
                        switch ($scope.item.type) {
                            case 'Corpus':
                                $route.updateParams({section: 'corpora'});
                                break;
                            case 'Lexique':
                                $route.updateParams({section: 'lexicons'});
                                break;
                            case 'Application':
                                $route.updateParams({section: 'applications'});
                                break;
                            case 'Outil':
                                $route.updateParams({section: 'tools'});
                                break;
                        }
                        $location.replace();
                        return;
                    }
                });

                $scope.ready = true;
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
