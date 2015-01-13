'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:item
 * @description
 * # item
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('item', [ 'ObjectResource', 'DownloadResource', 'N3Serializer',  function (ObjectResource, DownloadResource, N3Serializer) {
        return {
            restrict: 'EA',
            scope: {
                key: '='
            },
            templateUrl: 'market/directives/item.html',
            link: {
                post : function (scope) {

                    // Loads properties of each object
                    ObjectResource.get({oKey: scope.key}).$promise
                        .then(function (oobject) {

                            if (oobject.object.root === true) {
                                if (oobject.object.metadatas.length > 0) {
                                    
                                    var metaKey = oobject.object.metadatas[0].key;

                                    DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                        N3Serializer.fromN3(metaContent).then(function (data) {
                                            scope.oobject = oobject;
                                            scope.meta = data;
                                            if(data['http://www.ortolang.fr/ontology/image']) {
                                                
                                                ObjectResource.element({oKey: scope.key, path: data['http://www.ortolang.fr/ontology/image']}).$promise.then(function(oobject) {
                                                    scope.image = DownloadResource.getDownloadUrl({oKey: oobject.key});
                                                }, function (reason) {
                                                    console.error(reason);
                                                });
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
                }
            }
        };
    }]);
