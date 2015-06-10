'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributionsCtrl
 * @description
 * # ContributionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributionsCtrl', ['$scope', 'User', 'ObjectResource', 'DownloadResource',
        function ($scope, User, ObjectResource, DownloadResource) {

            angular.forEach(User.groups, function (key) {
                ObjectResource.get({key: key}).$promise.then(function (oobject) {
                    $scope.oobject = oobject;
                    $scope.downloadUrl = DownloadResource.getDownloadUrl({key: oobject.object.key});
                    //if (oobject.type === 'collection') {
                    //    if (oobject.object.root === true) {
                    //
                    //        if ($routeParams.view === 'browse') {
                    //            $scope.marketItemTemplate = 'market/market-item-collection.html';
                    //            return;
                    //        }
                    //
                    //        if (oobject.object.metadatas.length > 0) {
                    //
                    //            var metaKey = oobject.object.metadatas[0].key;
                    //
                    //            DownloadResource.download({key: metaKey}).success(function (metaContent) {
                    //                N3Serializer.fromN3(metaContent).then(function (data) {
                    //                    $scope.item = angular.copy(data);
                    //                    $scope.marketItemTemplate = 'market/market-item-root-collection.html';
                    //
                    //                    if (data['http://www.ortolang.fr/ontology/image']) {
                    //
                    //                        ObjectResource.element({key: key, path: data['http://www.ortolang.fr/ontology/image']}).$promise.then(function (oobject) {
                    //                            $scope.item.image = DownloadResource.getDownloadUrl({key: oobject.key});
                    //                        }, function (reason) {
                    //                            console.error(reason);
                    //                        });
                    //                    } else {
                    //                        if (data['http://purl.org/dc/elements/1.1/title']) {
                    //                            $scope.imgtitle = data['http://purl.org/dc/elements/1.1/title'].substring(0, 2);
                    //                            $scope.imgtheme = data['http://purl.org/dc/elements/1.1/title'].substring(0, 1).toLowerCase();
                    //                        } else {
                    //                            $scope.imgtitle = '';
                    //                            $scope.imgtheme = 'custom';
                    //                        }
                    //                    }
                    //
                    //                    if ($scope.item['http://www.ortolang.fr/ontology/preview'] !== undefined && $scope.item['http://www.ortolang.fr/ontology/preview'] !== '') {
                    //                        //loadPreview(key, $scope.item['http://www.ortolang.fr/ontology/preview']);
                    //                    }
                    //
                    //                    if ($scope.item['http://www.ortolang.fr/ontology/license'] !== undefined && $scope.item['http://www.ortolang.fr/ontology/license'] !== '') {
                    //                        //loadLicence(key, $scope.item['http://www.ortolang.fr/ontology/license']);
                    //                    }
                    //
                    //                    if ($scope.item['http://www.ortolang.fr/ontology/datasize'] !== undefined && $scope.item['http://www.ortolang.fr/ontology/datasize'] !== '') {
                    //                        $scope.datasizeToPrint = {'value': $scope.item['http://www.ortolang.fr/ontology/datasize']};
                    //                    }
                    //                });
                    //            }).error(function (reason) {
                    //                console.error(reason);
                    //            });
                    //        }
                    //    } else {
                    //        $scope.marketItemTemplate = 'market/market-item-collection.html';
                    //    }
                    //    //} else if (oobject.type === 'object') {
                    //    //    $scope.marketItemTemplate = 'market/market-item-data-object.html';
                    //} else if (oobject.type === 'link') {
                    //    console.log('follow link');
                    //} else {
                    //    console.log('load item key not found view');
                    //}
                }, function (reason) {
                    console.error(reason);
                });
            });

        }
]);
