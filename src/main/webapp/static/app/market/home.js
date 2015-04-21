'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'JsonResultResource', 'QueryBuilderService', function ($scope, $rootScope, $routeParams, $location, $window, JsonResultResource, QueryBuilderService) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $rootScope.selectSearch();
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (entry) {
            if (entry.applicationUrl) {
                $window.open(entry.applicationUrl);
            } else {
                $location.path('/market/item/' + entry.key);
            }
        };

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.corpora = [];
            $scope.lexiques = [];
            $scope.outils = [];
            $scope.website = [];
            $scope.news = [];

            $scope.content = '';
        }

        function searchType(type) {
            var queryBuilder = QueryBuilderService.make({projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl', source: 'collection'});

            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.in('meta_ortolang-item-json.title', ['Littéracie Avancée', 'Corpus14', 'Comere']);
            
            var query = queryBuilder.toString();
            console.log('query : ' + query);
            JsonResultResource.get({query: query}).$promise.then(function (jsonResults) {
                angular.forEach(jsonResults, function(jsonResult) {
                    $scope.items.push(angular.fromJson(jsonResult));
                });
            }, function (reason) {
                console.error(reason);
            });
        }

        function init() {
            initScopeVariables();

            $scope.items = [];
            $scope.section = $routeParams.section;
            // loadObjects();
            searchType($scope.section);
        }
        init();

    }]);
