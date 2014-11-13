'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataListCtrl
 * @description
 * # MetadataListCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataListCtrl', ['$scope', '$rootScope', '$routeParams', 'WorkspaceElementResource', function ($scope, $rootScope, $routeParams, WorkspaceElementResource) {

        $scope.metadataFormats = [
            {
                id: 'market-ortolang-n3',
                name: 'Présentation',
                view: 'workspace/metadata-form-market-ortolang.html'
            },
            {
                id: 'oai_dc',
                name: 'OAI Dublin Core',
                view: 'workspace/metadata-form-oai_dc.html'
            }
        ];

        $scope.userMetadataFormat = null;
        $scope.dropdownMetadataFormats = [{
            'text': 'Présentation',
            'click': 'showMetadataEditor("market-ortolang-n3")'
        },
            {
                'text': 'OAI Dublin Core',
                'click': 'showMetadataEditor("oai_dc")'
            }
        ];

        $scope.showMetadataEditor = function (format) {
            var metadataFormat;
            angular.forEach($scope.metadataFormats, function (md) {
                if (md.id === format) {
                    metadataFormat = md;
                }
            });
            $rootScope.$broadcast('metadata-editor-show', metadataFormat);
        };

        $scope.editMetadata = function (clickEvent, metadata) {
            // Get metadata content
            WorkspaceElementResource.get({wsName: $scope.selectedElements[0].workspace, path: $scope.selectedElements[0].path, metadata: metadata.name},
                function (data) {
                    var metadataFormat;
                    angular.forEach($scope.metadataFormats, function (md) {
                        if (md.id === data.format) {
                            metadataFormat = md;
                        }
                    });
                    $rootScope.$broadcast('metadata-editor-edit', metadataFormat, data);
                },
                function () {
                    //TODO send error message
                    console.error('Get metadata content of ' + metadata.name + ' failed !');
                });

        };

        $scope.previewMetadata = function (metadata) {
            $rootScope.$broadcast('metadata-preview', metadata);
        };

        $scope.deleteMetadata = function (metadata) {
            WorkspaceElementResource.delete({wsName: $scope.wsName, path: $scope.selectedElements[0].path, metadataname: metadata.name}, function () {
                $scope.selectedMetadata = undefined;
                $scope.refreshSelectedElement();
            });
        };

        $scope.middle = '';

        $scope.metadataListVisibility = false;

        $scope.showMetadataList = function () {
            $scope.metadataListVisibility = true;
        };

        $scope.hideMetadataList = function () {
            $scope.metadataListVisibility = false;
        };

        $scope.toggleMetadataList = function () {
            $scope.metadataListVisibility = !$scope.metadataListVisibility;
        };

        $scope.isMetadataListShow = function () {
            return $scope.metadataListVisibility;
        };


        // ********* //
        // Listeners //
        // ********* //

        $scope.$on('metadata-list-show', function (event) {
            $scope.toggleMetadataList();
        });

        $scope.$on('metadata-list-push', function (event, metadata) {
            $scope.middle = 'middle';
        });

        $scope.$on('metadata-list-unpush', function (event, metadata) {
            $scope.middle = '';
            // Refresh list of metadata
            $scope.refreshSelectedElement();
        });

    }]);
