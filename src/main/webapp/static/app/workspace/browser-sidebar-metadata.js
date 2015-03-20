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
            if ($scope.metadataEditorListVisibility === true) {
                $scope.hideMetadataEditorList();
            } else {
                $scope.showMetadataEditorList();
            }
        };

        $scope.isMetadataEditorListShow = function () {
            return $scope.metadataEditorListVisibility === true;
        };


        $scope.userMetadataFormat = null;

        $scope.showMetadataEditor = function (format) {
            var metadataFormat;
            angular.forEach($scope.metadataFormats, function (md) {
                if (md.name === format) {
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
                        if (md.name === data.format) {
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
                            entry.view = 'workspace/metadata-form-market-ortolang.html';
                            entry.displayed = false;
                        }
                        $scope.metadataFormats.push(entry);
                    });
                },
                function(reason) {
                    console.error('Cant list metadata formats ; failed cause '+reason+' !');
                }
            );
        }

        function init() {
            $scope.metadataFormats = [];
            // $scope.metadataFormats = [
            //     {
            //         id: 'ortolang-item-json',
            //         name: 'Item',
            //         description: 'Les métadonnées de présentation permettent de paramétrer l\'affichage de la ressource dans la partie consultation du site.',
            //         view: 'workspace/metadata-form-market-ortolang.html',
            //         displayed: false
            //     },
            //     {
            //         id: 'oai_dc',
            //         name: 'OAI Dublin Core',
            //         description: 'Les métadonnées OAI Dublin core permettent d\'être accessible via la protocole OAI-PMH.',
            //         view: 'workspace/metadata-form.html',
            //         displayed: true
            //     }
            // ];
            loadMetadataFormats();
        }
        init();

    }]);
