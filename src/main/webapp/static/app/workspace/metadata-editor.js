'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataEditorCtrl
 * @description
 * # MetadataEditorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataEditorCtrl', ['$scope', '$rootScope', '$http', 'Url', 'DownloadResource', 'WorkspaceElementResource', function ($scope, $rootScope, $http, Url, DownloadResource, WorkspaceElementResource) {

        // ***************** //
        // Editor visibility //
        // ***************** //

        $scope.editorVisibility = false;

        $scope.showEditor = function () {
            $scope.editorVisibility = true;
            $scope.resizeAsideBody();
        };

        $scope.hideEditor = function () {
            $scope.editorVisibility = false;
            resetMetadataFormat();
        };

        $scope.toggleEditor = function () {
            if ($scope.editorVisibility === true) {
                $scope.hideEditor();
            } else {
                $scope.showEditor();
            }
        };

        $scope.isEditorShow = function () {
            return $scope.editorVisibility === true;
        };

        // ******** //
        // Metadata //
        // ******** //

        $scope.selectedMetadata = undefined;
        $scope.selectedMetadataContent = undefined;

        function loadMetadataContent(view, metadata) {
            $scope.selectedMetadata = metadata;

            DownloadResource.download({oKey: metadata.key}).success(function (data) {
                $scope.selectedMetadataContent = data;

                $scope.metadataForm = view;

                $scope.showEditor();
            }).error(function () {
                resetMetadata();
            });
        }

        $scope.deleteMetadata = function () {
            WorkspaceElementResource.delete({wskey: $scope.wskey, path: $scope.selectedElements[0].path, metadataname: $scope.selectedMetadata.name}).$promise.then(
                function () {
                    $scope.selectedMetadata = undefined;
                    $scope.refreshSelectedElement();
                },
                function (reason) {
                    console.error('Cant delete metadata with name ' + $scope.selectedMetadata.name + ' failed cause '+reason+' !');
                }
            );
        };

        $scope.submitMetadataForm = function() {
            $rootScope.$broadcast('metadata-form-submit');
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

            fd.append('format', $scope.userMetadataFormat.id);
            fd.append('name', encodeURIComponent($scope.userMetadataFormat.name));

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
            $scope.showEditor();
        });

        $scope.$on('metadata-editor-edit', function (event, metadataFormat, metadata) {

            $scope.userMetadataFormat = metadataFormat;

            loadMetadataContent(metadataFormat.view, metadata);
        });

        $scope.$on('metadata-editor-create', function (event, content, contentType) {
            sendForm(content, contentType);
        });


        // *********************** //
        //          Resize         //
        // *********************** //

        $scope.resizeAsideBody = function () {
            var topOffset = $('#main-navbar').innerHeight(),
                height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

            height = height - topOffset;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                if ($rootScope.uploadQueueStatus === 'active') {
                    height -= angular.element('.upload-queue').innerHeight();
                }
                $('#metadataEditorBody').css('height', height + 'px');
            }
        };

    }]);
