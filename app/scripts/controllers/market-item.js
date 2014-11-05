'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$http', 'Url', 'ObjectResource', 'DownloadResource', 'N3Serializer', 'VisualizerManager', '$compile', function ($rootScope, $scope, $routeParams, $http, Url, ObjectResource, DownloadResource, N3Serializer, VisualizerManager, $compile) {

        function loadItem(key) {
            ObjectResource.get({oKey: key}, function (oobject) {
                $scope.oobject = oobject;

                if (oobject.type === 'collection') {
                    if (oobject.object.root === true) {
                        console.debug('routeParams', $routeParams.view);
                        if ($routeParams.view === 'browse') {
                            console.debug('load collection view');
                            $scope.marketItemTemplate = 'views/browser.html';
                            return;
                        }
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
                        }
                    } else {
                        console.debug('load collection view');
                        $scope.marketItemTemplate = 'views/browser.html';
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

        $scope.showPreview = function (preview) {

            if(preview !== undefined && preview !== '') {
                //TODO Get preview file or collection
                ObjectResource.get({oKey: preview}, function (oobject) {
                    console.info(oobject);
                    var visualizers = VisualizerManager.getCompatibleVisualizers(oobject.object.mimeType, oobject.object.name);

                    if(visualizers.length > 0) {
                        finishPreview(visualizers[0], oobject);
                    }
                });
                //TODO si la cle n'existe pas afficher quelque chose !!
            }
        };

        function finishPreview(visualizer, oobject) {

            //var scopePreview = {children: [{downloadUrl: DownloadResource.getDownloadUrl({oKey: oobject.object.key}), description: oobject.object.description, name: oobject.object.name}]};
            // angular.extend($scope, scopePreview);
            oobject.object.downloadUrl = DownloadResource.getDownloadUrl({oKey: oobject.object.key});
            var isolatedScope = $rootScope.$new();
            isolatedScope.elements = [];
            isolatedScope.elements.push(oobject.object);

            var element = $compile(visualizer.element)(isolatedScope),
                visualizerModal = $('#visualizer-modal');
            visualizerModal.find('.modal-header strong').text(visualizer.name);
            visualizerModal.find('.modal-body').empty().append(element);
            visualizerModal.modal('show');
        }

        // Scope variables
        function initScopeVariables() {
            $scope.itemKey = $routeParams.itemKey;
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
