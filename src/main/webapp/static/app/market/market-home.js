'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketHomeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'JsonResultResource', 'QueryBuilderService', function ($scope, $rootScope, $routeParams, $location, $window, JsonResultResource, QueryBuilderService) {

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

            if(type==='corpora') {
                queryBuilder.and();
                queryBuilder.equals('meta_ortolang-item-json.type', 'Corpus');
            } else if(type==='websites') {
                queryBuilder.and();
                queryBuilder.equals('meta_ortolang-item-json.type', 'Site web');
            } else if(type==='lexicons') {
                queryBuilder.and();
                queryBuilder.equals('meta_ortolang-item-json.type', 'Lexique');
            } else if(type==='tools') {
                queryBuilder.and();
                queryBuilder.equals('meta_ortolang-item-json.type', 'Outil');
            } else if(type==='news') {
                queryBuilder.and();
                queryBuilder.in('meta_ortolang-item-json.title', ['Littéracie Avancée', 'Corpus 14', 'CoMeRe (Communication médiée par les réseaux)']);
            }

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
