'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$scope', '$routeParams', 'icons', 'QueryBuilderFactory', 'FacetedFilterManager', 'SearchResource', function ($scope, $routeParams, icons, QueryBuilderFactory, FacetedFilterManager, SearchResource) {

        function loadItem(id) {

            var queryBuilder = QueryBuilderFactory.make({
                projection: '*',
                source: 'Person'
            });

            queryBuilder.addProjection('meta_ortolang-referentiel-json.img', 'img');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.emailhash', 'emailhash');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');

            queryBuilder.equals('meta_ortolang-referentiel-json.id', id);

            SearchResource.json({query: queryBuilder.toString()}, function (jsonResults) {
                if(jsonResults.length>0) {
                    $scope.contributor = angular.fromJson(jsonResults[0]);

                    loadResources($scope.contributor['@rid']);
                }
            });
        }

        function loadResources(contributorRID) {
            if (contributorRID) {
                $scope.queryBuilder.and();
                $scope.queryBuilder.in('meta_ortolang-item-json.contributors[entity]', [contributorRID]);
                $scope.query = $scope.queryBuilder.toString();
            }
        }

        // Scope variables
        function initScopeVariables() {
            $scope.contributor = undefined;

            $scope.query = '';
            $scope.queryBuilder = QueryBuilderFactory.make({
                projection: 'key',
                source: 'collection'
            });

            $scope.queryBuilder.addProjection('meta_ortolang-item-json.type', 'type');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.title', 'title');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.image', 'image');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.applicationUrl', 'applicationUrl');
            $scope.queryBuilder.addProjection('meta_ortolang-item-json.publicationDate', 'publicationDate');

            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
            $scope.queryBuilder.addProjection('meta_ortolang-workspace-json.versionName', 'version');
            $scope.queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

            $scope.queryBuilder.equals('status', 'published');

            var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            $scope.viewMode = viewModeGrid;
            $scope.orderDirection = true;
            var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            $scope.orderProp = orderPublicationDate;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.contributorId);
        }

        init();

    }]);
