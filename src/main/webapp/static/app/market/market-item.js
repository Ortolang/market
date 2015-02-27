'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$window', 'icons', 'ObjectResource', 'DownloadResource', 'N3Serializer', 'VisualizerManager', '$compile', function ($rootScope, $scope, $routeParams, $window, icons, ObjectResource, DownloadResource, N3Serializer, VisualizerManager, $compile) {

        function loadItem(key) {
            $scope.itemKey = key;

            ObjectResource.get({oKey: key}).$promise.then(function (oobject) {
                $scope.oobject = oobject;
                $scope.downloadUrl = DownloadResource.getDownloadUrl({oKey: oobject.object.key});

                if (oobject.type === 'collection') {
                    if (oobject.object.root === true) {

                        if ($routeParams.view === 'browse') {
                            $scope.marketItemTemplate = 'market/market-item-collection.html';
                            return;
                        }

                        if (oobject.object.metadatas.length > 0) {

                            var metaKey = oobject.object.metadatas[0].key;

                            DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                N3Serializer.fromN3(metaContent).then(function (data) {
                                    $scope.item = angular.copy(data);
                                    $scope.marketItemTemplate = 'market/market-item-root-collection.html';

                                    if(data['http://www.ortolang.fr/ontology/image']) {

                                        ObjectResource.element({oKey: key, path: data['http://www.ortolang.fr/ontology/image']}).$promise.then(function(oobject) {
                                            $scope.item.image = DownloadResource.getDownloadUrl({oKey: oobject.key});
                                        }, function (reason) {
                                            console.error(reason);
                                        });
                                    } else {
                                        if(data['http://purl.org/dc/elements/1.1/title']) {
                                            $scope.imgtitle = data['http://purl.org/dc/elements/1.1/title'].substring(0,2);
                                            $scope.imgtheme = data['http://purl.org/dc/elements/1.1/title'].substring(0,1).toLowerCase();
                                        } else {
                                            $scope.imgtitle = '';
                                            $scope.imgtheme = 'custom';
                                        }
                                    }

                                    if($scope.item['http://www.ortolang.fr/ontology/preview']!==undefined && $scope.item['http://www.ortolang.fr/ontology/preview']!=='') {
                                        loadPreview(key, $scope.item['http://www.ortolang.fr/ontology/preview']);
                                    }

                                    if($scope.item['http://www.ortolang.fr/ontology/license']!==undefined && $scope.item['http://www.ortolang.fr/ontology/license']!=='') {
                                        loadLicence(key, $scope.item['http://www.ortolang.fr/ontology/license']);
                                    }

                                    if($scope.item['http://www.ortolang.fr/ontology/datasize']!==undefined && $scope.item['http://www.ortolang.fr/ontology/datasize']!=='') {
                                        $scope.datasizeToPrint = {'value':$scope.item['http://www.ortolang.fr/ontology/datasize']};
                                    }
                                });
                            }).error(function (reason) {
                                console.error(reason);
                            });
                        }
                    } else {
                        $scope.marketItemTemplate = 'market/market-item-collection.html';
                    }
                //} else if (oobject.type === 'object') {
                //    $scope.marketItemTemplate = 'market/market-item-data-object.html';
                } else if (oobject.type === 'link') {
                    console.log('follow link');
                } else {
                    console.log('load item key not found view');
                }
            }, function (reason) {
                console.error(reason);
            });
        }

        $scope.browse = false;

        function loadPreview(collection, previewPath) {
            ObjectResource.element({oKey: collection, path: previewPath}).$promise.then(function(oobject) {
                $scope.previewCollection = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

        $scope.showPreview = function (preview) {
            if(preview !== undefined && preview !== '') {

                ObjectResource.get({oKey: preview}).$promise.then(function (oobject) {
                    var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                    if(visualizers.length > 0) {
                        finishPreview(visualizers[0], oobject);
                    }
                });
            }
        };

        function finishPreview(visualizer, oobject) {

            oobject.object.downloadUrl = DownloadResource.getDownloadUrl({oKey: oobject.object.key});
            var isolatedScope = $rootScope.$new();
            isolatedScope.elements = [];
            isolatedScope.elements.push(oobject.object);

            var element = $compile(visualizer.getElement())(isolatedScope),
                visualizerModal = $('.visualizer-modal');
            visualizerModal.find('.modal-content').empty().append(element);
            visualizerModal.modal('show');
        }

        function loadLicence(collection, licencePath) {
            ObjectResource.element({oKey: collection, path: licencePath}).$promise.then(function(oobject) {
                $scope.licenceDataObject = oobject;

                DownloadResource.download({oKey: $scope.licenceDataObject.key}).success(function (data) {
                    $scope.licenceData = data;
                }).error(function (error) {
                    console.error(error);
                });
            }, function (reason) {
                console.error(reason);
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.itemKey = undefined; // Key of the object
            $scope.oobject = undefined; // Ortolang representation of the object
            $scope.item = undefined; // RDF representation of the object
            $scope.previewCollection = undefined;
            $scope.marketItemTemplate = undefined; // Show info, browse, ...
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.itemKey);

        }
        init();

    }]);
