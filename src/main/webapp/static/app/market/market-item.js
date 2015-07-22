'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItemCtrl
 * @description
 * # MarketItemCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItemCtrl', ['$rootScope', '$scope', '$routeParams', '$translate', '$location', '$filter', 'ObjectResource', 'JsonResultResource', 'VisualizerManager', 'QueryBuilderFactory', 'Settings', 'Content', function ($rootScope, $scope, $routeParams, $translate, $location, $filter, ObjectResource, JsonResultResource, VisualizerManager, QueryBuilderFactory, Settings, Content) {

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
                        
                        $rootScope.ortolangPageTitle = getValue($scope.item.title, 'lang', Settings.language, 'untitle');

                        if($scope.item.schema) {

                            if($scope.item.schema === 'http://www.ortolang.fr/schema/012#') {
                                $scope.marketItemTemplate = 'market/templates/market-item-12.html';

                                $scope.browse = $location.search().browse;

                                refreshMultilingualValue($scope.item, Settings.language);

                                if($scope.item.image) {
                                    ObjectResource.element({key: key, path: $scope.item.image}).$promise.then(function(oobject) {
                                        $scope.image = Content.getContentUrlWithKey(oobject.key);
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

                                // if($scope.item.preview!==undefined) {
                                //     loadPreview(key, $scope.item.preview.paths);
                                // }

                                if($scope.item.license!==undefined && $scope.item.license!=='') {
                                    loadLicense(key, $scope.item.license);
                                }

                                if($scope.item.datasize!==undefined && $scope.item.datasize!=='') {
                                    $scope.datasizeToPrint = {'value':$filter('bytes')($scope.item.datasize)};
                                }
                            } else {
                                //TODO show message like format metadata unknown
                            }
                            
                        } else {
                            //TODO show message like format metadata unknown
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
        function getValues(arr, propertyName, propertyValue) {
            var values = [];
            if(arr) { 
                var iObject;
                for (iObject = 0; iObject < arr.length; iObject++) {
                    if (arr[iObject][propertyName] === propertyValue) {
                        values.push(arr[iObject].value);
                    }
                }
            }
            return values;
        }

        function getValue(arr, propertyName, propertyValue, defaultValue) {
            var values = getValues(arr, propertyName, propertyValue);

            if(arr && values.length === 0) {
                return arr.length>0 ? arr[0].value : defaultValue;
            }

            return values[0];
        }

        function refreshMultilingualValue(item, lang) {
            $scope.title = getValue(item.title, 'lang', lang, 'untitle');
            $scope.description = getValue(item.description, 'lang', lang);
            if(item.keywords) {
                $scope.keywords = getValues(item.keywords, 'lang', lang);
                if($scope.keywords.length === 0) {
                    $scope.keywords = getValues(item.keywords, 'lang', 'fr');
                }
            }
            if(item.bibliographicCitation) {
                $scope.bibliographicCitation = getValue(item.bibliographicCitation, 'lang', lang);
            }
            if(item.publications) {
                $scope.primaryPublications = getValues(item.publications, 'priority', 'primary');
            }
            if(item.publications) {
                $scope.secondaryPublications = getValues(item.publications, 'priority', 'secondary');
            }
        }

        function loadLicense(collection, licensePath) {
            ObjectResource.element({key: collection, path: licensePath}).$promise.then(function(oobject) {
                $scope.licenseDataObject = oobject;
            }, function (reason) {
                console.error(reason);
            });
        }

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

        $rootScope.$on('$translateChangeSuccess', function () {
            if($scope.item) {
                refreshMultilingualValue($scope.item, $translate.use());
            }
        });
        // Scope variables
        function initScopeVariables() {
            // Key of the object
            $scope.itemKey = undefined;
            // RDF representation of the object
            $scope.item = undefined;
            // Show info, browse, ...
            $scope.marketItemTemplate = undefined;
            $scope.image = undefined;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.itemKey);
        }

        init();

    }]);
