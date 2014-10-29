'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$scope', '$routeParams', '$http', 'Url', 'ObjectResource', 'N3Serializer', function ($scope, $routeParams, $http, Url, ObjectResource, N3Serializer) {

        function loadItem(key) {
            ObjectResource.get({oKey: key}, function (oobject) {
                $scope.oobject = oobject;

                if (oobject.type === 'collection') {
                    if (oobject.object.root === true) {
                        console.debug('load root collection view');

                        if (oobject.object.metadatas.length > 0) {
                            //TODO find metadata in Resource name or rdf format ??
                            var metaKey = oobject.object.metadatas[0].key;

                            $http.get(Url.urlBase() + '/rest/objects/' + metaKey + '/download').success(function (metaContent) {
                                N3Serializer.fromN3(metaContent).then(function (data) {
                                    $scope.item = angular.copy(data);
                                    $scope.marketItemTemplate = 'views/market-item-root-collection.html';
                                });
                            }).error(function () {
                                // resetMetadata();
                                //TODO send error message
                            });

                            // ObjectResource.download({oKey: metaKey}, function(metaContent) {
                            // console.debug(metaContent);
                            // N3Serializer.fromN3(metaContent).then(function(data) {
                            // $scope.item = angular.copy(data);
                            // });

                            // });
                        }
                    } else {
                        console.debug('load collection view');
                        $scope.marketItemTemplate = 'views/market-item-collection.html';
                    }
                } else if (oobject.type === 'object') {
                    console.debug('load data object view');
                    $scope.marketItemTemplate = 'views/market-item-data-object.html';
                } else if (oobject.type === 'link') {
                    console.debug('follow link');
                } else {
                    console.debug('load item key not found view');
                }
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.oobject = undefined;
            $scope.item = undefined;
            $scope.marketItemTemplate = undefined;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.itemKey);
        }
        init();

    }]);
