'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$window', 'icons', 'ObjectResource', 'DownloadResource', 'JsonResultResource', 'VisualizerManager', '$compile', function ($rootScope, $scope, $routeParams, $window, icons, ObjectResource, DownloadResource, JsonResultResource, VisualizerManager, $compile) {

        function loadItem(key) {
            $scope.itemKey = key;

            if ($routeParams.view === 'browse') {
                $scope.marketItemTemplate = 'market/market-item-collection.html';
                return;
            }

            var queryStr = 'select * from OrtolangObject where ortolang_status = \'published\' and ortolang_key = \''+key+'\' ';
            console.log(queryStr);
            JsonResultResource.get({query: queryStr}).$promise.then(function (jsonResults) {
                if(jsonResults.length===1) {

                    $scope.downloadUrl = DownloadResource.getDownloadUrl({oKey: key});
                    $scope.ortolangObject = angular.fromJson(jsonResults[0]);

                    var queryOrtolangMeta = 'select from '+$scope.ortolangObject.ortolang_meta;
                    JsonResultResource.get({query: queryOrtolangMeta}).$promise.then(function (jsonObject) {
                        $scope.item = angular.fromJson(jsonObject[0]);

                        $scope.marketItemTemplate = 'market/market-item-root-collection.html';

                        if($scope.item.image) {
                            ObjectResource.element({oKey: key, path: $scope.item.image}).$promise.then(function(oobject) {
                                $scope.item.image = DownloadResource.getDownloadUrl({oKey: oobject.key});
                            }, function (reason) {
                                console.error(reason);
                            });
                        } else {                            
                            $scope.imgtitle = '';
                            $scope.imgtheme = 'custom';
                            if($scope.item.title) {
                                $scope.imgtitle = $scope.item.title.substring(0,2);
                                $scope.imgtheme = $scope.item.title.substring(0,1).toLowerCase();
                            }
                        }

                        if($scope.item.preview!==undefined && $scope.item.preview!=='') {
                            loadPreview(key, $scope.item.preview);
                        }

                        if($scope.item.licence!==undefined && $scope.item.licence!=='') {
                            loadLicence(key, $scope.item.licence);
                        }

                        if($scope.item.datasize!==undefined && $scope.item.datasize!=='') {
                            $scope.datasizeToPrint = {'value':$scope.item.datasize};
                        }
                    }, function (reason) {
                    console.error(reason);
                });
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
