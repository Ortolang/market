'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketHomeCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$window', 'JsonResultResource', function ($scope, $rootScope, $routeParams, $location, $window, JsonResultResource) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $rootScope.selectSearch();
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (entry) {
            // if (entry.meta && entry.meta['http://www.ortolang.fr/ontology/applicationUrl']) {
            //     $window.open(entry.meta['http://www.ortolang.fr/ontology/applicationUrl']);
            // } else {
                $location.path('/market/item/' + entry.key);
            // }
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
            var ortolangType = '';
            if(type==='corpora') {
                ortolangType = 'Corpus';
            } else if(type==='websites') {
                ortolangType = 'Site web';
            } else if(type==='lexicons') {
                ortolangType = 'Lexique';
            } else if(type==='tools') {
                ortolangType = 'Outil';
            }

            if(ortolangType!=='') {
                //TODO news (propriete star/new?)
                var queryStr = 'select ortolang_key as key, ortolang_meta.title as title, ortolang_meta.description, ortolang_meta.image as image from OrtolangObject where ortolang_status = \'published\' and ortolang_meta.type = \''+ortolangType+'\'';
                JsonResultResource.get({query: queryStr}).$promise.then(function (jsonResults) {
                    angular.forEach(jsonResults, function(jsonResult) {
                        $scope.items.push(angular.fromJson(jsonResult));
                    });
                }, function (reason) {
                    console.error(reason);
                });
            } 
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
