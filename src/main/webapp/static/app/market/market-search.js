'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', '$filter', 'JsonResultResource', 'QueryBuilderService', function ($scope, $location, $routeParams, $filter, JsonResultResource, QueryBuilderService) {

        $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.filter = function (filterID, filterValue, filterTranslation) {
            if (filterID && filterValue) {
                if (filterID === 'type') {
                    $scope.itemsFiltered = $filter('filter')($scope.items, {'type': filterValue});
                    $scope.selectedType = filterValue;
                    $scope.selectedTypeTranslation = filterTranslation;
                } else {
                    $scope.itemsFiltered = $filter('filter')($scope.items, {'meta': {filterID: filterValue}});
                }
            }
        };

        $scope.resetFilter = function () {
            $scope.itemsFiltered = angular.copy($scope.items);
            $scope.selectedType = '';
            $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
        };


        function loadObjects(content) {

            var queryBuilder = QueryBuilderService.make({projection: 'key, meta.type as type, meta.title as title, meta.description as description, meta.producer as producer', source: 'collection'});

            queryBuilder.equals('status', 'published');

            var contentSplit = [];
            if (content && content !== '') {
                contentSplit = queryBuilder.tokenize(content);
            }
            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    queryBuilder.and();
                    queryBuilder.containsText('meta.*', contentPart);
                });
            } else {
                queryBuilder.and();
                queryBuilder.containsText('meta.*', content);
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            // Loads all objects
            JsonResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    var jsEntry = angular.fromJson(entry);
                    $scope.items.push(jsEntry);
                    $scope.itemsFiltered.push(jsEntry);
                });

            });
        }

        // Scope variables
        function initScopeVariables() {
            // All items find by the query
            $scope.items = [];
            // List of items filtered by one or more facets
            $scope.itemsFiltered = [];
            $scope.content = '';

            $scope.selectedType = '';
        }

        function init() {
            initScopeVariables();

            $scope.content = $routeParams.content;
            loadObjects($routeParams.content);
        }
        init();

    }]);
