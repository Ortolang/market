'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserSidebarMetadataCtrl
 * @description
 * # BrowserSidebarMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserSidebarMetadataCtrl', ['$scope', '$rootScope', 'WorkspaceElementResource', 'MetadataFormatResource', function ($scope, $rootScope, WorkspaceElementResource, MetadataFormatResource) {

        $scope.metadataEditorListVisibility = false;

        $scope.showMetadataEditorList = function () {
            $scope.metadataEditorListVisibility = true;
        };

        $scope.hideMetadataEditorList = function () {
            $scope.metadataEditorListVisibility = false;
        };

        $scope.toggleMetadataEditorList = function () {
            if ($scope.metadataEditorListVisibility) {
                $scope.hideMetadataEditorList();
            } else {
                $scope.showMetadataEditorList();
            }
        };

        $scope.isMetadataEditorListShow = function () {
            return $scope.metadataEditorListVisibility;
        };


        $scope.userMetadataFormat = null;

        $scope.showMetadataEditor = function (formatName) {
            var metadataFormat;
            angular.forEach($scope.metadataFormats, function (md) {
                if (md.name === formatName) {
                    metadataFormat = md;
                }
            });
            $rootScope.$broadcast('metadata-editor-show', metadataFormat);
        };

        $scope.editMetadata = function (metadata) {
            // Get metadata content
            WorkspaceElementResource.get({wskey: $scope.selectedElements[0].workspace, path: $scope.selectedElements[0].path, metadata: metadata.name}).$promise.then(
                function (data) {
                    var metadataFormat;
                    angular.forEach($scope.metadataFormats, function (md) {
                        if (md.key === data.format) {
                            metadataFormat = md;
                        }
                    });
                    $rootScope.$broadcast('metadata-editor-edit', metadataFormat, data);
                },
                function (reason) {
                    console.error('Get metadata content of ' + metadata.name + ' failed cause ' + reason + '!');
                }
            );
        };

        $scope.previewMetadata = function (metadata) {
            $rootScope.$broadcast('metadata-preview', metadata);
        };

        $scope.deleteMetadata = function (metadata) {
            WorkspaceElementResource.delete({wskey: $scope.wskey, path: $scope.selectedElements[0].path, metadataname: metadata.name}).$promise.then(
                function () {
                    $scope.selectedMetadata = undefined;
                    $scope.refreshSelectedElement();
                },
                function (reason) {
                    console.error('Cant delete metadata with name ' + metadata.name + ' failed cause '+reason+' !');
                }
            );
        };

        function loadMetadataFormats() {
            MetadataFormatResource.get().$promise.then(
                function(data) {
                    angular.forEach(data.entries, function(entry) {
                        if(entry.name === 'ortolang-item-json') {
                            entry.view = 'workspace/metadata-form-schema.html';
                            entry.displayed = false;
                        }
                        MetadataFormatResource.download({mdfKey:entry.key}).$promise.then(
                            function(schema) {
                                entry.schemaContent = schema;

                                $scope.metadataFormats.push(entry);
                            },
                            function(reason) {
                                console.error('Cant get schema of metadata formats '+entry.name+' ; failed cause '+reason+' !');
                            }
                        );
                    });
                },
                function(reason) {
                    console.error('Cant list metadata formats ; failed cause '+reason+' !');
                }
            );
        }

        function init() {
            $scope.metadataFormats = [];
            loadMetadataFormats();
        }
        init();

    }]);
