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
            var query = 'SELECT ortolang_key as key, ortolang_meta.type as type, ortolang_meta.title as title, ortolang_meta.description as description, ortolang_meta.producer as producer FROM OrtolangObject WHERE ortolang_status = \'published\' ', contentSplit = [];

            // if (content && content !== '' && content[0] !== '"') {
            //     contentSplit = content.split(' ');
            // }

            // if (contentSplit.length > 0) {
            //     angular.forEach(contentSplit, function (contentPart) {
            //         var str = contentPart.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
            //         query += ' AND ortolang_meta.* containsText \'' + str + '\' OR ortolang_meta.producer IN \'' + str + '\'';
            //     });
            // } else {
            //     query += ' AND ortolang_meta.* containsText \'' + content + '\' OR ortolang_meta.producer IN \'' + content + '\'';
            // }

            query += ' AND '+textFacetToQuery('*', content) + ' OR '+ arrayFacetToQuery('producer', content) +' OR '+ arrayFacetToQuery('researcher', content);

            console.debug('query : ' + query);
            // Loads all objects
            JsonResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    // if (entry.explain) {
                    //     entry.explain = entry.explain.replace(/highlighted/gi, 'strong');
                    // }
                    var jsEntry = angular.fromJson(entry);
                    $scope.items.push(jsEntry);
                    $scope.itemsFiltered.push(jsEntry);
                });

                // $scope.itemsFiltered = angular.copy($scope.items);
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
                    query += 'ortolang_meta.'+name+' containsText \'' + str + '\'';
                }); //TODO ajouter AND
                query += ')';
            } else {
                query += ' ortolang_meta.'+name+' containsText \'' + content + '\'';
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
                    query += ' ortolang_meta.'+name+' IN \'' + str + '\'';
                });
            } else {
                query += ' ortolang_meta.'+name+' IN \'' + content + '\'';
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
