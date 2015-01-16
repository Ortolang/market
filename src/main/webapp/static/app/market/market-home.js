'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketHomeCtrl', ['$scope', '$location', 'ObjectResource', 'DownloadResource', 'N3Serializer', function ($scope, $location, ObjectResource, DownloadResource, N3Serializer) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (entry) {
            $location.path('/market/' + entry.key);
        };

        function loadObjects() {
            // Loads all objects
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(function (oobjects) {
                var index = 0;
                angular.forEach(oobjects.entries, function (entry) {
                    $scope.items.push({key: entry, rang: index});
                    index++;
                });

                loadMetadata();
            });
        }

        function loadMetadata() {

            angular.forEach($scope.items, function (item) {
                // Loads properties of each object
                ObjectResource.get({oKey: item.key}).$promise
                    .then(function (oobject) {

                        if (oobject.object.root === true) {
                            if (oobject.object.metadatas.length > 0) {
                                
                                var metaKey = oobject.object.metadatas[0].key;

                                DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                    N3Serializer.fromN3(metaContent).then(function (data) {
                                       
                                        if ( data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type']==='Corpus') {
                                            $scope.corpus.push(item);
                                        }
                                        if ( data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type']==='Lexique') {
                                            $scope.lexiques.push(item);
                                        }
                                        if ( data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type']==='Outil') {
                                            $scope.outils.push(item);
                                        }
                                        if ( data['http://www.ortolang.fr/ontology/statusOfUse'] && data['http://www.ortolang.fr/ontology/statusOfUse']==='Libre') {
                                            $scope.free.push(item);
                                        }
                                    });
                                }).error(function (error) {
                                    console.error('error during process : ' + error);
                                });
                            }
                        }
                    }, function (reason) {
                        console.error(reason);
                });
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.corpus = [];
            $scope.lexiques = [];
            $scope.outils = [];
            $scope.free = [];

            $scope.content = '';
        }

        function init() {
            initScopeVariables();
            loadObjects();
        }
        init();

    }]);
