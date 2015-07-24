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
            $scope.orderDirection = false;
            $scope.orderProp = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};

            var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate',
                    source: 'collection'
                });

            queryBuilder.addProjection('meta_ortolang-item-json.statusOfUse', 'statusOfUse');

            queryBuilder.addProjection('meta_ortolang-workspace-json.wskey', 'wskey');
            queryBuilder.addProjection('lastModificationDate', 'lastModificationDate');

            queryBuilder.equals('status', 'published');

            queryBuilder.and();
            queryBuilder.equals('meta_ortolang-item-json.type', 'Application');

            $scope.query = queryBuilder.toString();
        }

        function init() {
            initScopeVariables();
        }
        init();

    }]);
