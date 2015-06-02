'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('HomeCtrl', ['$scope', '$routeParams', '$location', '$window', 'JsonResultResource', 'QueryBuilderFactory', function ($scope, $routeParams, $location, $window, JsonResultResource, QueryBuilderFactory) {

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

            $scope.content = '';
        }

        function searchType(type) {
            var queryBuilder = QueryBuilderFactory.make({projection: 'key, meta_ortolang-item-json.title as title, meta_ortolang-item-json.description as description, meta_ortolang-item-json.image as image, meta_ortolang-item-json.applicationUrl as applicationUrl, meta_ortolang-item-json.publicationDate as publicationDate', source: 'collection'});

            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.in('meta_ortolang-item-json.title', ['Littéracie Avancée', 'Corpus 14', 'CoMeRe (Communication médiée par les réseaux)']);

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
            searchType($scope.section);
        }
        init();

    }]);
