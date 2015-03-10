'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', '$filter', 'JsonResultResource', function ($scope, $location, $routeParams, $filter, JsonResultResource) {

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

            // var query = ' STATUS:PUBLISHED', contentSplit = [];
            var query = 'SELECT key, meta.type as type, meta.title as title, meta.description as description, meta.producer as producer FROM collection WHERE status = \'published\' ';

            query += ' AND ' + textFacetToQuery('*', content) + ' OR '+ arrayFacetToQuery('producer', content) +' OR '+ arrayFacetToQuery('researcher', content);

            console.debug('query : ' + query);
            // Loads all objects
            JsonResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    var jsEntry = angular.fromJson(entry);
                    $scope.items.push(jsEntry);
                    $scope.itemsFiltered.push(jsEntry);
                });

            });
        }

        function textFacetToQuery(name, content) {
            var contentSplit = [], query = '';
            if (content && content !== '' && content[0] !== '"') {
                contentSplit = content.split(' ');
            }
            if (contentSplit.length > 0) {
                query += '(';
                angular.forEach(contentSplit, function (contentPart) {
                    var str = contentPart.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
                    query += 'meta.'+name+' containsText \'' + str + '\'';
                });
                query += ')';
            } else {
                query += ' meta.'+name+' containsText \'' + content + '\'';
            }

            return query;
        }

        function arrayFacetToQuery(name, content) {
            var contentSplit = [], query = '';
            if (content && content !== '' && content[0] !== '"') {
                contentSplit = content.split(' ');
            }
            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    var str = contentPart.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
                    query += ' meta.'+name+' IN \'' + str + '\'';
                });
            } else {
                query += ' meta.'+name+' IN \'' + content + '\'';
            }

            return query;
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
