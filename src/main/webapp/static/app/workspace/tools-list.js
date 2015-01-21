'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsListCtrl
 * @description
 * # ToolsListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsListCtrl', ['$scope', 'ObjectResource', 'DownloadResource', 'N3Serializer', function ($scope, ObjectResource, DownloadResource, N3Serializer) {

        // ***************** //
        // Editor visibility //
        // ***************** //

        $scope.visibility = false;

        $scope.show = function () {
            $scope.visibility = true;
            // $scope.resizeAsideBody();
        };

        $scope.hide = function () {
            $scope.visibility = false;
            // resetMetadataFormat();
        };

        $scope.toggle = function () {
            if ($scope.visibility === true) {
                $scope.hide();
            } else {
                $scope.show();
            }
        };

        $scope.isShow = function () {
            return $scope.visibility === true;
        };

        // Tools list //

        $scope.selectTool = function(tool) {
            $scope.selectedTool = tool;
        };

        $scope.resetSelectedTool = function() {
            $scope.selectedTool = undefined;
        };

        $scope.hasToolSelected = function() {
            return $scope.selectedTool !== undefined;
        };

        $scope.loadToolsList = function() {
            // $scope.tools = [
            //     {id: 'tika', name: 'Tika', description: 'Detects and extracts metadata and text content.'},
            //     {id: 'sample-tool', name: 'Sample tool', description: 'Dumb tool for demonstration purpose.'}
            // ];
            // Loads all objects
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(function (oobjects) {
                var index = 0;
                var items = [];
                angular.forEach(oobjects.entries, function (entry) {
                    items.push({key: entry, rang: index});
                    index++;
                });

                loadMetadata(items);
            });
        };
        
        function loadMetadata(items) {

            angular.forEach(items, function (item) {
                // Loads properties of each object
                ObjectResource.get({oKey: item.key}).$promise
                    .then(function (oobject) {

                        if (oobject.object.root === true) {
                            if (oobject.object.metadatas.length > 0) {
                                
                                var metaKey = oobject.object.metadatas[0].key;

                                DownloadResource.download({oKey: metaKey}).success(function (metaContent) {
                                    N3Serializer.fromN3(metaContent).then(function (data) {
                                       
                                        if ( data['http://www.ortolang.fr/ontology/type'] && data['http://www.ortolang.fr/ontology/type']==='Outil') {
                                            item.id = data['http://www.ortolang.fr/ontology/toolId'];
                                            item.name = data['http://purl.org/dc/elements/1.1/title'];
                                            item.description = data['http://purl.org/dc/elements/1.1/description'];
                                            item.meta = data;

                                            $scope.tools.push(item);
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
            });
        }

        // ********* //
        // Listeners //
        // ********* //

        $scope.$on('tools-list-show', function () {
            $scope.resetSelectedTool();
            $scope.show();
        });


        function init() {
            $scope.tools = [];
            $scope.loadToolsList();
            $scope.selectedTool = undefined;

        }

        init();
    }]);