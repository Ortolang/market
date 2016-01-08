'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducersCtrl
 * @description
 * # ProducersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducersCtrl', ['$scope', 'QueryBuilderFactory', 'Search', function ($scope, QueryBuilderFactory, Search) {

        $scope.search = function () {
            var query = buildQuery();
            Search.search(query, true);
        };

        function buildQuery() {
            var queryBuilder = QueryBuilderFactory.make({
                projection: 'meta_ortolang-referentiel-json.fullname as fullname, meta_ortolang-referentiel-json.name as name, meta_ortolang-referentiel-json.id as id, meta_ortolang-referentiel-json.img as img, meta_ortolang-referentiel-json.homepage as homepage',
                source: 'Organization'
            });
            // queryBuilder.equals('meta_ortolang-referentiel-json.type', 'Organization');
            // var contentSplit = [];
            // if ($scope.content && $scope.content !== '') {
            //     contentSplit = queryBuilder.tokenize($scope.content);
            // }
            // if (contentSplit.length > 0) {
            //     angular.forEach(contentSplit, function (contentPart) {
            //         // queryBuilder.and();
            //         queryBuilder.containsText('any()', contentPart);
            //     });
            // }

            // angular.forEach(this.enabledFilters, function(filter) {
            //     queryBuilder.and();
            //     if(filter.getType() ==='array') {
            //         queryBuilder.in(filter.getId(), filter.getSelectedOptionsValues());
            //     } else {
            //         queryBuilder.equals(filter.getId(), filter.getSelectedOptionsValues());
            //     }
            // });

            return queryBuilder.toString();
        }

        function initScopeVariables() {
            //       var viewModeLine = {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'};
            //       var viewModeGrid = {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'};
            //       $scope.viewModes = [viewModeGrid, viewModeLine];
            // $scope.viewMode = viewModeGrid;

            // $scope.orderDirection = true;
            // var orderTitle = {id: 'title', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'};
            // var orderPublicationDate = {id: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'};
            // $scope.orderProps = [orderTitle, orderPublicationDate];
            // $scope.orderProp = orderPublicationDate;
        }

        function init() {
            initScopeVariables();
            $scope.Search = Search;

            $scope.search();
        }
        init();

    }]);
