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

        $scope.search = function() {
            if($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
                // $location.url('/search?content='+encodeURIComponent($scope.content));
            }
        };


        function loadObjects(content) {

        	var query = ' STATUS:PUBLISHED', contentSplit = content.split(' ');

        	if (contentSplit.length > 0) {
        		angular.forEach(contentSplit, function(contentPart) {
        			query += ' AND CONTENT:' + encodeURIComponent(contentPart) + '~';
        		});
        	}

            // Loads all objects
            IndexResultResource.get({query: query}).$promise.then(function (results) {
                
                angular.forEach(results, function (entry) {
                    


                    // Loads properties of each object
                    ObjectResource.get({oKey: entry.root}).$promise
                        .then(function (oobject) {
                            
                            if (oobject.object.root === true) {
                                if (oobject.object.metadatas.length > 0) {
                                    //TODO find metadata in Resource name or rdf format ??
                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {

                                            $scope.items.push({oobject: oobject, meta: data, result: entry});
                                        });
                                    }).error(function (error) {
                                        console.error('error during process : ' + error);
                                    });
                                }
                            }
                        },
                        function(reason) {
                            console.error(reason);
                        });
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
            loadObjects($routeParams.content);
        }
        init();

    }]);