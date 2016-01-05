'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$scope', '$routeParams', 'icons', 'QueryBuilderFactory', 'FacetedFilterManager', 'SearchResource', function ($scope, $routeParams, icons, QueryBuilderFactory, FacetedFilterManager, SearchResource) {

        function loadItem(id) {

            var queryBuilder = QueryBuilderFactory.make({
                projection: '*',
                source: 'Organization'
            });

            queryBuilder.addProjection('meta_ortolang-referentiel-json.img', 'img');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.fullname', 'fullname');
            queryBuilder.addProjection('meta_ortolang-referentiel-json.homepage', 'homepage');

            queryBuilder.equals('meta_ortolang-referentiel-json.id', id);

            SearchResource.json({query: queryBuilder.toString()}, function (results) {
                if(results.length>0) {
                    $scope.producer = angular.fromJson(results[0]);

                    if (!$scope.producer.img) {
                        $scope.imgtitle = '';
                        $scope.imgtheme = 'custom';
                    }

                    loadResources($scope.producer['@rid']);
                }
            });
        }

        function loadResources(producerRID) {
            if (producerRID) {
                $scope.queryBuilder.and();
                $scope.queryBuilder.in('meta_ortolang-item-json.producers', [producerRID]);
                $scope.query = $scope.queryBuilder.toString();
            }
        }

        // Scope variables
        function initScopeVariables() {
            $scope.producer = undefined;

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
            loadItem($routeParams.producerId);
        }

        init();

    }]);
