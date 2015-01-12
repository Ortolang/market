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

        $scope.clickItem = function (item) {
            $location.path('/market/' + item.oobject.key);
        };

        function loadObjects() {
            // Loads all objects
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(function (oobjects) {

                angular.forEach(oobjects.entries, function (entry) {

                    // Loads properties of each object
                    ObjectResource.get({oKey: entry}).$promise
                        .then(function (oobject) {

                            if (oobject.object.root === true) {
                                if (oobject.object.metadatas.length > 0) {
                                    
                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {
                                            var item = {};
                                            item.oobject = oobject;
                                            item.meta = data;
                                            if(data['http://www.ortolang.fr/ontology/image']) {
                                                
                                                ObjectResource.element({oKey: entry, path: data['http://www.ortolang.fr/ontology/image']}).$promise.then(function(oobject) {
                                                    item.image = DownloadResource.getDownloadUrl({oKey: oobject.key});
                                                }, function (reason) {
                                                    console.error(reason);
                                                });
                                            }
                                            $scope.items.push(item);

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
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.content = '';
        }

        function init() {
            initScopeVariables();
            loadObjects();
        }
        init();

    }]);
