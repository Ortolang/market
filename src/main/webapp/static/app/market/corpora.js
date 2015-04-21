'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:CorporaCtrl
 * @description
 * # CorporaCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('CorporaCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'JsonResultResource', 'QueryBuilderService', function ($scope, $rootScope, $routeParams, $location, $window, JsonResultResource, QueryBuilderService) {

        // $scope.search = function () {
        //     if ($scope.content !== '') {
        //         $rootScope.selectSearch();
        //         $location.search('content', $scope.content).path('/search');
        //     }
        // };

        $scope.clickItem = function (entry) {
            if (entry.applicationUrl) {
                $window.open(entry.applicationUrl);
            } else {
                $location.path('/market/item/' + entry.key);
            }
        };

        $scope.addFilter = function (filterID, filterValue, filterTranslation) {
            var filters = {};
            if (filterID && filterValue) {
                if (filterID === 'type') {
                    filters.type = filterValue;

                    $scope.selectedType = filterValue;
                    $scope.selectedTypeTranslation = filterTranslation;
                }
            }

            $scope.applyFilters(filters);
        };

        $scope.removeFilter = function(filterID) {
            if($scope.filters[filterID]) {
                delete $scope.filters[filterID];
                applyFilters($scope.filters);
            }
        }

        $scope.applyFilters = function (filters) {
            if (filters) {
                $scope.filters = filters;
                $scope.itemsFiltered = $filter('filter')($scope.items, filters);
            }
        };

        $scope.resetFilterType = function () {
            $scope.removeFilter('type');

            $scope.selectedType = '';
            $scope.selectedTypeTranslation = 'MARKET.ALL_TYPE';
        };


        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.itemsFiltered = [];

            $scope.filters = {};

            $scope.selectedType = '';
            $scope.selectedTypeTranslation = 'MARKET.CORPORA_TYPE';

            $scope.selectedLang = '';
            $scope.selectedLangTranslation = 'MARKET.LANG_TYPE';

            $scope.content = '';
        }

        $scope.searchContent = function(content) {
            var queryBuilder = QueryBuilderService.make({projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl', source: 'collection'});

            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.equals('meta_ortolang-item-json.type', 'Corpus');
            
            var contentSplit = [];
            if (content && content !== '') {
                contentSplit = queryBuilder.tokenize(content);
            }
            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    queryBuilder.and();
                    queryBuilder.containsText('meta_ortolang-item-json.*', contentPart);
                });
            }

            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                angular.forEach(jsonResults, function(jsonResult) {
                    var jsEntry = angular.fromJson(jsonResult);
                    $scope.items.push(jsEntry);
                    $scope.itemsFiltered.push(jsEntry);
                });
            }, function (reason) {
                console.error(reason);
            });
        }

        function init() {
            initScopeVariables();

            $scope.content = $routeParams.content;
            $scope.searchContent($scope.content);
        }
        init();

    }]);
