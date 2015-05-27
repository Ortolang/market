'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'ObjectResource', 'DownloadResource', 'JsonResultResource', 'VisualizerManager', 'QueryBuilderFactory', '$compile', function ($rootScope, $scope, $routeParams, $location, ObjectResource, DownloadResource, JsonResultResource, VisualizerManager, QueryBuilderFactory, $compile) {

        function loadItem(key) {
            $scope.itemKey = key;

            if ($routeParams.view === 'browse') {
                $scope.marketItemTemplate = 'market/market-item-collection.html';
                return;
            }

            var queryBuilder = QueryBuilderFactory.make({projection: '*', source: 'collection'});
            queryBuilder.equals('status', 'published');
            queryBuilder.and();
            queryBuilder.equals('key', key);

            // var queryStr = 'select * from collection where status = \'published\' and key = \''+key+'\' ';
            console.log(queryBuilder.toString());
            JsonResultResource.get({query: queryBuilder.toString()}).$promise.then(function (jsonResults) {
                if(jsonResults.length===1) {

                    $scope.downloadUrl = DownloadResource.getDownloadUrl({oKey: key});
                    $scope.ortolangObject = angular.fromJson(jsonResults[0]);

                    var queryOrtolangMeta = 'select from '+$scope.ortolangObject['meta_ortolang-item-json'];
                    JsonResultResource.get({query: queryOrtolangMeta}).$promise.then(function (jsonObject) {
                        $scope.item = angular.fromJson(jsonObject[0]);
                        $rootScope.title = $scope.item.title;

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

                        if($scope.item.license!==undefined && $scope.item.license!=='') {
                            loadLicense(key, $scope.item.license);
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

        function loadPreview(collection, previewPath) {
            ObjectResource.element({oKey: collection, path: previewPath}).$promise.then(function (oobject) {
                $scope.previewCollection = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

        $scope.showPreview = function (preview) {
            if (preview !== undefined && preview !== '') {

                ObjectResource.get({oKey: preview}).$promise.then(function (oobject) {
                    var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                    if (visualizers.length > 0) {
                        finishPreview(visualizers[0], oobject);
                    }
                });
            }
        };

        $scope.browseContent = function () {
            $scope.browse = !$scope.browse;
            if ($scope.browse) {
                $location.search('browse', true);
            } else {
                // Clear search parts by keeping only the path
                $location.url($location.path());
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

        function loadLicense(collection, licensePath) {
            ObjectResource.element({oKey: collection, path: licensePath}).$promise.then(function(oobject) {
                $scope.licenseDataObject = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

        // Scope variables
        function initScopeVariables() {
            // Key of the object
            $scope.itemKey = undefined;
            // Ortolang representation of the object
            $scope.oobject = undefined;
            // RDF representation of the object
            $scope.item = undefined;
            $scope.previewCollection = undefined;
            // Show info, browse, ...
            $scope.marketItemTemplate = undefined;

            $scope.browse = $location.search().browse;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.itemKey);
        }

        init();

    }]);
