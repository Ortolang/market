'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$translate', '$location', '$filter', '$modal', 'ObjectResource', 'JsonResultResource', 'VisualizerManager', 'QueryBuilderFactory', 'Settings', 'Content', '$compile', function ($rootScope, $scope, $routeParams, $translate, $location, $filter, $modal, ObjectResource, JsonResultResource, VisualizerManager, QueryBuilderFactory, Settings, Content, $compile) {

        function getValues(arr, propertyName, propertyValue) {
            var values = [];
            var iObject;
            for (iObject = 0; iObject < arr.length; iObject++) {
                if (arr[iObject][propertyName] === propertyValue) {
                    values.push(arr[iObject].value);
                }
            }
            return values;
        }

        function getValue(arr, propertyName, propertyValue, defaultValue) {
            var values = getValues(arr, propertyName, propertyValue);

            if(values.length === 0) {
                return arr.length>0 ? arr[0].value : defaultValue;
            }

            return values[0];
        }

        function refreshMultilingualValue(lang) {
            $scope.title = getValue($scope.item.title, 'lang', lang, 'untitle');
            $scope.description = getValue($scope.item.description, 'lang', lang);
            $scope.keywords = getValues($scope.item.keywords, 'lang', lang);
            if($scope.keywords.length === 0) {
                $scope.keywords = getValues($scope.item.keywords, 'lang', 'fr');
            }
            $scope.bibliographicCitation = getValue($scope.item.bibliographicCitation, 'lang', lang);
            // $scope.bibliographicCitation = getMultilingualValue($scope.item.bibliographicCitation, Settings.language);
            $scope.primaryPublications = getValues($scope.item.publications, 'priority', 'primary');
            $scope.secondaryPublications = getValues($scope.item.publications, 'priority', 'secondary');

        }

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

                    $scope.downloadUrl = Content.getContentUrlWithKey(key);
                    $scope.ortolangObject = angular.fromJson(jsonResults[0]);

                    var queryOrtolangMeta = 'select from '+$scope.ortolangObject['meta_ortolang-item-json'];
                    JsonResultResource.get({query: queryOrtolangMeta}).$promise.then(function (jsonObject) {
                        $scope.item = angular.fromJson(jsonObject[0]);
                        
                        refreshMultilingualValue(Settings.language);

                        $rootScope.ortolangPageTitle = $scope.title;

                        $scope.marketItemTemplate = 'market/market-item-root-collection.html';

                        if($scope.item.image) {
                            ObjectResource.element({key: key, path: $scope.item.image}).$promise.then(function(oobject) {
                                $scope.item.image = Content.getContentUrlWithKey(oobject.key);
                            }, function (reason) {
                                console.error(reason);
                            });
                        } else {
                            $scope.imgtitle = '';
                            $scope.imgtheme = 'custom';
                            if($scope.title) {
                                $scope.imgtitle = $scope.title.substring(0,2);
                                $scope.imgtheme = $scope.title.substring(0,1).toLowerCase();
                            }
                        }

                        if($scope.item.preview!==undefined) {
                            loadPreview(key, $scope.item.preview.paths);
                        }

                        if($scope.item.license!==undefined && $scope.item.license!=='') {
                            loadLicense(key, $scope.item.license);
                        }

                        if($scope.item.datasize!==undefined && $scope.item.datasize!=='') {
                            $scope.datasizeToPrint = {'value':$filter('bytes')($scope.item.datasize)};
                        }
                    }, function (reason) {
                        console.error(reason);
                    });

                    var queryWorkspace = 'select from '+$scope.ortolangObject['meta_ortolang-workspace-json'];
                    JsonResultResource.get({query: queryWorkspace}).$promise.then(function (jsonObject) {
                        $scope.workspace = angular.fromJson(jsonObject[0]);

                        if($scope.workspace.wskey) {
                            var queryBuilder = QueryBuilderFactory.make({projection: 'key, meta_ortolang-workspace-json.versionName as versionName', source: 'collection'});
                            queryBuilder.equals('status', 'published');
                            queryBuilder.and();
                            queryBuilder.equals('meta_ortolang-workspace-json.wskey', $scope.workspace.wskey);

                            console.log(queryBuilder.toString());

                            JsonResultResource.get({query: queryBuilder.toString()}).$promise.then(function (jsonResults) {
                                $scope.versions = [];

                                angular.forEach(jsonResults, function(result) {
                                    var ortolangObject = angular.fromJson(result);

                                    $scope.versions.push(ortolangObject);
                                });


                            }, function (reason) {
                                console.error(reason);
                            });
                        }
                    }, function (reason) {
                        console.error(reason);
                    });

                }
            }, function (reason) {
                console.error(reason);
            });
        }

        function loadPreview(collection, paths) {
            $scope.previewFiles = [];
            angular.forEach(paths, function (path) {
                ObjectResource.element({key: collection, path: path}).$promise.then(function (oobject) {
                    $scope.previewFiles.push(oobject);
                }, function (reason) {
                    console.error(reason);
                });
            });
        }

        $scope.showPreview = function (preview) {
            if (preview !== undefined && preview !== '') {

                ObjectResource.get({key: preview}).$promise.then(function (oobject) {
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

        $scope.isProducer = function (contributor) {
            var iRole;
            for (iRole = 0; iRole < contributor.role.length; iRole++) {
                if (contributor.role[iRole] === 'producer') {
                    return true;
                }
            }
            return false;
        };

        function finishPreview(visualizer, oobject) {
            var element, modalScope, visualizerModal;
            oobject.object.downloadUrl = Content.getContentUrlWithKey(oobject.object.key);
            modalScope = $rootScope.$new();
            modalScope.elements = [];
            modalScope.elements.push(oobject.object);
            modalScope.forceFullData = true;

            element = $compile(visualizer.getElement())(modalScope);
            element.addClass('close-on-click');

            modalScope.visualizer = {
                header: {},
                content: {},
                footer: {}
            };
            visualizerModal = $modal({
                scope: modalScope,
                templateUrl: 'common/visualizers/visualizer-template.html',
                show: true
            });
            modalScope.$on('modal.show.before', function (event, modal) {
                modal.$element.find('.visualizer-content').append(element);
                modalScope.clickContent = function (event) {
                    if (angular.element(event.target).hasClass('close-on-click')) {
                        visualizerModal.hide();
                    }
                };
            });
        }

        function loadLicense(collection, licensePath) {
            ObjectResource.element({key: collection, path: licensePath}).$promise.then(function(oobject) {
                $scope.licenseDataObject = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

        $rootScope.$on('$translateChangeSuccess', function () {
            refreshMultilingualValue($translate.use());
        });

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
