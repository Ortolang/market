'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BrowserSidebarMetadataCtrl
 * @description
 * # BrowserSidebarMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BrowserSidebarMetadataCtrl', ['$scope', '$rootScope', 'WorkspaceElementResource', function ($scope, $rootScope, WorkspaceElementResource) {

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

        $scope.metadataFormats = [
            {
                id: 'market-ortolang-n3',
                name: 'Présentation',
                description: 'Les métadonnées de présentation permettent de paramétrer l\'affichage de la ressource dans la partie consultation du site.',
                view: 'workspace/metadata-form-market-ortolang.html',
                displayed: false
            },
            {
                id: 'oai_dc',
                name: 'OAI Dublin Core',
                description: 'Les métadonnées OAI Dublin core permettent d\'être accessible via la protocole OAI-PMH.',
                view: 'workspace/metadata-form-oai_dc.html',
                displayed: true
            }
        ];

        $scope.userMetadataFormat = null;

        $scope.showMetadataEditor = function (format) {
            var metadataFormat;
            angular.forEach($scope.metadataFormats, function (md) {
                if (md.id === format) {
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
                        if (md.id === data.format) {
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


    }]);
