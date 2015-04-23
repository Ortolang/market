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
                $location.url('/search?content=' + $scope.content);
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


        function loadObjects(content, operator, field) {

            var queryBuilder = QueryBuilderService.make({projection: 'key, meta_ortolang-item-json.type as type, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.producer as producer', source: 'collection'});

            queryBuilder.equals('status', 'published');

            var fieldName = (field)?field:'any()';
            if(operator) {
                if(operator === 'in') {
                    queryBuilder.and();
                    queryBuilder.in(fieldName, [content]);
                } else if(operator === 'eq') {
                    queryBuilder.and();
                    queryBuilder.equals(fieldName, content);
                } else if(operator === 'contains') {
                    queryBuilder.and();
                    queryBuilder.contains(fieldName, content);
                }
            } else {

                var contentSplit = [];
                if (content && content.length > 0) {
                    contentSplit = queryBuilder.tokenize(content);
                }
                if (contentSplit.length > 0) {
                    angular.forEach(contentSplit, function (contentPart) {
                        queryBuilder.and();
                        queryBuilder.containsText(fieldName, contentPart);
                    });
                } else {
                    queryBuilder.and();
                    queryBuilder.containsText(fieldName, content);
                }
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            // Loads all objects
            JsonResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    var jsEntry = angular.fromJson(entry);
                    $scope.items.push(jsEntry);
                    $scope.itemsFiltered.push(jsEntry);
                    incrementOptionLength(jsEntry);
                });

            });
        }

        function incrementOptionLength(item) {
            angular.forEach($scope.options, function(option) {
                if(option.name === item.type) {
                    option.length++;
                }
            });
        }

        // Scope variables
        function initScopeVariables() {
            // All items find by the query
            $scope.items = [];
            // List of items filtered by one or more facets
            $scope.itemsFiltered = [];
            $scope.content = '';

            $scope.options = [
                {
                    name: 'Corpus',
                    translation: 'CORPORA',
                    length: 0
                },
                {
                    name: 'Lexique',
                    translation: 'LEXICONS',
                    length: 0
                },
                {
                    name: 'Outil',
                    translation: 'TOOLS',
                    length: 0
                },
                {
                    name: 'Application',
                    translation: 'INTEGRATED_PROJECTS',
                    length: 0
                }
            ];
            $scope.selectedType = '';
        }

        function init() {
            initScopeVariables();

            $scope.content = $routeParams.content;
            loadObjects($routeParams.content, $routeParams.operator, $routeParams.field);
        }
        init();

    }]);
