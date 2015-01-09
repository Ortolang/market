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

        $scope.clickItem = function (item) {
            $location.path('/market/' + item.oobject.key);
        };


        function loadObjects(content, producer) {

        	var query = ' STATUS:PUBLISHED', contentSplit = [];

            if (content && content !== '') {
                contentSplit = content.split(' ');
            }

        	if (contentSplit.length > 0) {
        		angular.forEach(contentSplit, function(contentPart) {
        			// query += ' AND CONTENT:' + encodeURIComponent(contentPart) + '~';
                    var str = contentPart.replace(/\(/g, '\(').replace(/\)/g, '\)');
                    query += ' AND (CONTENT:' + str + '~ OR CONTENT:' + str + '*)';
        		});
        	}

            if (producer && producer !== '') {
                query += ' AND CONTENT:' + producer
            }

            console.debug('query : '+query);
            // Loads all objects
            IndexResultResource.get({query: query}).$promise.then(function (results) {
                
                angular.forEach(results, function (entry) {
                    
                    if(entry.explain) {

                        entry.explain = entry.explain.replace(/highlighted/gi, 'strong');
                    }

                    // Loads properties of each object
                    ObjectResource.get({oKey: entry.root}).$promise
                        .then(function (oobject) {
                            
                            if (oobject.object.root === true) {
                                if (oobject.object.metadatas.length > 0) {
                                    //TODO find metadata in Resource name or rdf format ??
                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {

                                            var image = 'assets/images/no-image.png';
                                            if(data['http://www.ortolang.fr/ontology/image']) {
                                                ObjectResource.element({oKey: oobject.key, path: data['http://www.ortolang.fr/ontology/image']}).$promise.then(function(oobjectImage) {
                                                    image = DownloadResource.getDownloadUrl({oKey: oobjectImage.key});
                                                }, function (reason) {
                                                    console.error(reason);
                                                    image = 'assets/images/no-image.png';
                                                });
                                            } else {
                                                image = 'assets/images/no-image.png';
                                            }

                                            $scope.items.push({oobject: oobject, meta: data, result: entry, image: image});
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
            var producer = ($routeParams.producer!==undefined && $routeParams.producer!=='')?$routeParams.producer:undefined;
            console.debug(producer);
            loadObjects($routeParams.content, producer);
        }
        init();

    }]);