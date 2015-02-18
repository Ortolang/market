'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', '$filter', 'IndexResultResource', function ($scope, $location, $routeParams, $filter, IndexResultResource) {

        $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.filter = function (filterID, filterValue, filterTranslation) {
            if (filterID && filterValue) {
                if (filterID === 'type') {
                    $scope.itemsFiltered = $filter('filter')($scope.items, {'meta': {'http://www.ortolang.fr/ontology/type': filterValue}});
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

            var query = ' STATUS:PUBLISHED', contentSplit = [];

            if (content && content !== '' && content[0] !== '"') {
                contentSplit = content.split(' ');
            }

            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    var str = contentPart.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
                    query += ' AND CONTENT:' + str + '*';
                });
            } else {
                query += ' AND CONTENT:' + content;
            }

            console.debug('query : ' + query);
            // Loads all objects
            IndexResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    if (entry.explain) {
                        entry.explain = entry.explain.replace(/highlighted/gi, 'strong');
                    }
                    $scope.items.push(entry);
                    $scope.itemsFiltered.push(entry);
                });

                // $scope.itemsFiltered = angular.copy($scope.items);
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
