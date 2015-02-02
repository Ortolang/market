'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$sce', '$routeParams', 'ObjectResource', 'DownloadResource', 'N3Serializer', 'VisualizerManager', '$compile', function ($rootScope, $scope, $sce, $routeParams, ObjectResource, DownloadResource, N3Serializer, VisualizerManager, $compile) {

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
                                        $scope.item.image = 'assets/images/no-image.png';
                                    }

                                    if($scope.item['http://www.ortolang.fr/ontology/preview']!==undefined && $scope.item['http://www.ortolang.fr/ontology/preview']!=='') {
                                        loadPreview(key, $scope.item['http://www.ortolang.fr/ontology/preview']);
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
                } else if (oobject.type === 'object') {
                    $scope.marketItemTemplate = 'market/market-item-data-object.html';
                } else if (oobject.type === 'link') {
                    console.debug('follow link');
                } else {
                    console.debug('load item key not found view');
                }
            }, function (reason) {
                console.error(reason);
            });
        }

        $scope.browse = false;

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

        function loadPreview(collection, previewPath) {
            ObjectResource.element({oKey: collection, path: previewPath}).$promise.then(function(oobject) {
                $scope.previewCollection = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

        function finishPreview(visualizer, oobject) {

            oobject.object.downloadUrl = DownloadResource.getDownloadUrl({oKey: oobject.object.key});
            var isolatedScope = $rootScope.$new();
            isolatedScope.elements = [];
            isolatedScope.elements.push(oobject.object);

            var element = $compile(visualizer.getElement())(isolatedScope),
                visualizerModal = $('.visualizer-modal');
            visualizerModal.find('.modal-header strong').text(visualizer.getName());
            visualizerModal.find('.modal-body').empty().append(element);
            visualizerModal.modal('show');
        }

        // Scope variables
        function initScopeVariables() {
            $scope.itemKey = undefined; // Key of the object
            $scope.oobject = undefined; // Ortolang representation of the object
            $scope.item = undefined; // RDF representation of the object
            $scope.previewCollection = undefined;
            $scope.marketItemTemplate = undefined; // Show info, browse, ...
            $scope.description = $sce.trustAsHtml('The layout&lt;br/&gt; inside.');
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.itemKey);

        }
        init();

    }]);
