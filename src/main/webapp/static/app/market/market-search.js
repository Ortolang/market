'use strict';

/**
 * @ngdoc function
 * @name MarketSearchCtrl.controller:MarketSearchCtrl
 * @description
 * # MarketSearchCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketSearchCtrl', ['$scope', '$location', '$routeParams', 'ObjectResource', 'DownloadResource', 'N3Serializer', 'IndexResultResource', function ($scope, $location, $routeParams, ObjectResource, DownloadResource, N3Serializer, IndexResultResource) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (item) {
            $location.path('/market/' + item.root);
        };


        function loadObjects(content, producer) {

            var query = ' STATUS:PUBLISHED', contentSplit = [];

            if (content && content !== '') {
                contentSplit = content.split(' ');
            }

            if (contentSplit.length > 0) {
                angular.forEach(contentSplit, function (contentPart) {
                    var str = contentPart.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
                    query += ' AND (CONTENT:' + str + '~ OR CONTENT:' + str + '*)';
                });
            }

            if (producer && producer !== '') {
                query += ' AND CONTENT:' + producer;
            }

            console.debug('query : ' + query);
            // Loads all objects
            IndexResultResource.get({query: query}).$promise.then(function (results) {

                angular.forEach(results, function (entry) {

                    if (entry.explain) {
                        entry.explain = entry.explain.replace(/highlighted/gi, 'strong');
                    }
                    
                    $scope.items.push(entry);
                });
            });
        }


        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.content = '';
        }

        function init() {
            initScopeVariables();

            $scope.content = $routeParams.content;
            var producer = ($routeParams.producer !== undefined && $routeParams.producer !== '') ? $routeParams.producer : undefined;
            loadObjects($routeParams.content, producer);
        }
        init();

    }]);
