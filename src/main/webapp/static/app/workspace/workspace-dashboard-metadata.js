'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$rootScope', '$scope', '$location', '$filter', '$modal', 'ortolangType', 'ObjectResource', 'Workspace', 'WorkspaceElementResource', 'Content',
        function ($rootScope, $scope, $location, $filter, $modal, ortolangType, ObjectResource, Workspace, WorkspaceElementResource, Content) {

            $scope.applyChange = function () {
                startSubmit();

                $scope.submitForm();
            };

            $scope.submitForm = function () {
                console.log('submit form');

                var error = false;
                if(angular.isUndefined($scope.metadata.type)) {
                    $scope.errors.type = true;
                    error = true;
                } else {
                    $scope.errors.type = false;
                }

                if(angular.isUndefined($scope.metadata.title)) {
                    $scope.errors.title = true;
                    error = true;
                } else {
                    $scope.errors.title = false;
                }

                if(angular.isUndefined($scope.metadata.description)) {
                    $scope.errors.description = true;
                    error = true;
                } else {
                    $scope.errors.description = false;
                }

                if(error) {
                    abortSubmit();
                    showErrorMessages();
                    return;
                }

                delete $scope.metadata.imageUrl;

                $scope.metadata.publicationDate = $filter('date')(new Date(), 'yyyy-MM-dd');

                var content = angular.toJson($scope.metadata),
                    contentType = 'text/json';

                sendForm(content, contentType);
            };

            function sendForm(content, contentType) {

                var fd = new FormData(),
                    currentPath = '/';

                fd.append('path', currentPath);
                fd.append('type', ortolangType.metadata);

                // fd.append('format', $scope.userMetadataFormat.key);
                fd.append('name', 'ortolang-item-json');

                var blob = new Blob([content], { type: contentType});

                fd.append('stream', blob);

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function () {
                    Workspace.refreshActiveWorkspaceMetadata().then(function() {
                        Workspace.getActiveWorkspaceMetadata().then(function() {

                            $scope.applying = false;
                            $location.search('section', 'preview');
                        });
                    });
                });
            }

            function startSubmit() {
                $scope.submitButtonText = '<span class="fa fa-refresh fa-spin"></span> Sauvegarde...';
                $scope.applying = true;
            }

            function abortSubmit() {
                $scope.submitButtonText = 'Appliquer';
                $scope.applying = false;
            }

            /**
             * Methods on person
             **/

            function prepareModalScopeForErrorMessages() {
                var modalScope = $rootScope.$new(true);

                return modalScope;
            }

            function showErrorMessages () {

                var modalScope = prepareModalScopeForErrorMessages(),
                    addContributorModal;

                modalScope.errors = $scope.errors;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                addContributorModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/error-messages-modal.html'
                });
            }


            var deregisterFileImageSelectModal = $rootScope.$on('browserSelectedElements-fileImageSelectModal', function ($event, elements) {
                
                $scope.metadata.image = elements[0].path;
                $scope.image = Content.getContentUrlWithKey(elements[0].key);
                $scope.fileImageSelectModal.hide();
            });

            $scope.$on('$destroy', function () {
                deregisterFileImageSelectModal();
            });

            function init() {
                $scope.submitButtonText = 'Appliquer';
                $scope.errors = {title: false, type: false, description: false};
                $scope.activeTab = 0;
                if(Workspace.active.metadata!==null) {
                    $scope.metadata = angular.copy(Workspace.active.metadata);
                } else {
                    $scope.metadata = {schema: 'http://www.ortolang.fr/schema/013#'};
                }

                // Sets datasize
                ObjectResource.size({key: Workspace.active.workspace.head}, function (data) {
                    $scope.metadata.datasize = data.size.toString();
                });

                // File selector for the image
                var fileImageSelectModalScope = $rootScope.$new();
                fileImageSelectModalScope.acceptMultiple = false;
                fileImageSelectModalScope.forceMimeTypes = ['ortolang/collection', 'image'];
                fileImageSelectModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileImageSelectModalScope.forceHead = true;
                fileImageSelectModalScope.fileSelectId = 'fileImageSelectModal';
                $scope.fileImageSelectModal = $modal({
                    scope: fileImageSelectModalScope,
                    title: 'WORKSPACE.METADATA_EDITOR.SELECT_LOGO',
                    template: 'common/directives/file-select-modal-template.html',
                    show: false
                });

                // Sets image
                if ($scope.metadata.image) {
                    ObjectResource.element({key: Workspace.active.workspace.head, path: $scope.metadata.image}).$promise.then(function (oobject) {
                        $scope.image = Content.getContentUrlWithKey(oobject.key);
                    });
                } else {
                    $scope.imgtitle = 'Cliquez pour ajouter votre logo';
                    $scope.imgtheme = 'ortolang';
                }

            }
            init();
        }]);
