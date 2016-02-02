'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'icons', 'QueryBuilderFactory', function ($scope, icons, QueryBuilderFactory) {

        function initScopeVariables() {

            $scope.viewMode = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            $scope.orderDirection = true;
            $scope.orderProp = {id: 'publicationDate', sort: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};

            var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key',
                    source: 'collection'
                });

            queryBuilder.addProjection('meta_ortolang-item-json.type', 'type');
            queryBuilder.addProjection('meta_ortolang-item-json.title', 'title');
            queryBuilder.addProjection('meta_ortolang-item-json.description', 'description');
            queryBuilder.addProjection('meta_ortolang-item-json.image', 'image');
            queryBuilder.addProjection('meta_ortolang-item-json.applicationUrl', 'applicationUrl');
            queryBuilder.addProjection('meta_ortolang-item-json.publicationDate', 'publicationDate');

            queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');

            queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
            queryBuilder.addProjection('meta_ortolang-workspace-json.wsalias', 'alias');
                queryBuilder.addProjection('meta_ortolang-workspace-json.snapshotName', 'snapshotName');
            queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

            queryBuilder.equals('status', 'published').and().equals('meta_ortolang-item-json.type', 'Application');

            $scope.query = queryBuilder.toString();
        }

        function init() {
            initScopeVariables();

            $scope.type = 'Application';
        }
        init();

    }]);
