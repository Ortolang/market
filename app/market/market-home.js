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
                // $location.url('/search?content='+encodeURIComponent($scope.content));
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
                                    //TODO find metadata in Resource name or rdf format ??
                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {

                                            $scope.items.push({oobject: oobject, meta: data});
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
