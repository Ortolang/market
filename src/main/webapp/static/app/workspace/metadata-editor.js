'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataEditorCtrl
 * @description
 * # MetadataEditorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataEditorCtrl', ['$scope', '$rootScope', '$http', 'Url', 'DownloadResource', 'WorkspaceElementResource', 'FormResource', 'MetadataFormatResource', function ($scope, $rootScope, $http, Url, DownloadResource, WorkspaceElementResource, FormResource, MetadataFormatResource) {

        // ***************** //
        // Editor visibility //
        // ***************** //

        $scope.editorVisibility = false;

        $scope.showEditor = function () {
            $scope.editorVisibility = true;
        };

        $scope.hideEditor = function () {
            $scope.editorVisibility = false;
            resetMetadataFormat();
        };

        $scope.toggleEditor = function () {
            if ($scope.editorVisibility) {
                $scope.hideEditor();
            } else {
                $scope.showEditor();
            }
        };

        $scope.isEditorShow = function () {
            return $scope.editorVisibility;
        };

        // ******** //
        // Metadata //
        // ******** //

        $scope.selectedMetadata = undefined;
        $scope.selectedMetadataContent = undefined; //TODO remove this property

        function loadMetadataContent(view, metadata) {
            $scope.selectedMetadata = metadata;

            DownloadResource.download({oKey: metadata.key}).success(function (metadataContent) {
                $scope.selectedMetadataContent = metadataContent;

                $scope.metadataForm = $scope.userMetadataFormat.view;

                FormResource.get({formKey: $scope.userMetadataFormat.form}).$promise.then(function (userForm) {
                    $scope.form = angular.fromJson(userForm.definition);
                    $scope.schema = $scope.userMetadataFormat.schemaContent;
                    $scope.model = angular.fromJson(metadataContent);
                    
                    $scope.showEditor();
                }, function (reason) {
                    console.log('unable to load form '+$scope.userMetadataFormat.form+' cause of '+reason);
                });

            }).error(function () {
                resetMetadata();
            });
        }

        $scope.submitMetadataForm = function() {
            $rootScope.$broadcast('metadata-form-submit', $scope.model);
        };

        function resetMetadata() {
            $scope.selectedMetadata = undefined;
            $scope.selectedMetadataContent = undefined;
        }


        // **** //
        // Form //
        // **** //

        $scope.userMetadataFormat = undefined;
        $scope.metadataForm = undefined;

        function resetMetadataFormat() {
            $scope.userMetadataFormat = undefined;
            $scope.metadataForm = undefined;
        }

        function sendForm(content, contentType) {

            var uploadUrl = Url.urlBase() + '/rest/workspaces/' + $scope.selectedElements[0].workspace + '/elements/',
                fd = new FormData(),
                currentPath = $scope.selectedElements[0].path;

            fd.append('path', currentPath);
            fd.append('type', 'metadata');

            fd.append('format', $scope.userMetadataFormat.key);
            fd.append('name', $scope.userMetadataFormat.name);

            var blob = new Blob([content], { type: contentType});

            fd.append('stream', blob);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function () {

                $scope.hideEditor();
                resetMetadataFormat();
                $scope.refreshSelectedElement();
            })
            .error(function (error) {
                console.error('creation of metadata failed !', error);
                $scope.hideEditor();
                resetMetadataFormat();
            });
        }

        // ********* //
        // Listeners //
        // ********* //

        $scope.$on('metadata-editor-show', function (event, metadataFormat) {
            resetMetadata();
            $scope.userMetadataFormat = metadataFormat;
            $scope.metadataForm = metadataFormat.view;

            FormResource.get({formKey: metadataFormat.form}).$promise.then(function (data) {
                $scope.form = angular.fromJson(data.definition);
                $scope.schema = metadataFormat.schemaContent;
                $scope.model = {};

                $scope.showEditor();
            }, function (reason) {
                console.log('unable to load form '+metadataFormat.form+' cause of '+reason);
            });
        });

        $scope.$on('metadata-editor-edit', function (event, metadataFormat, metadata) {
            resetMetadata();
            $scope.userMetadataFormat = metadataFormat;

            loadMetadataContent(metadataFormat.view, metadata);
        });

        $scope.$on('metadata-editor-create', function (event, content, contentType) {
            sendForm(content, contentType);
        });
    }]);
