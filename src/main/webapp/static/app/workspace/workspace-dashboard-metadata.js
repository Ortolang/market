'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$filter',
        '$modal',
        'ortolangType',
        'ObjectResource',
        'Workspace',
        'WorkspaceElementResource',
        'Content',
        'WorkspaceMetadataService',
        'MetadataFormatResource',
        'OrtolangIitemJsonMigration',
        'User',
        function ($rootScope, $scope, $location, $filter, $modal, ortolangType, ObjectResource, Workspace, WorkspaceElementResource, Content, WorkspaceMetadataService, MetadataFormatResource, OrtolangIitemJsonMigration, User) {
            function startSubmit() {
                $scope.submitButtonText = '<span class="fa fa-refresh fa-spin"></span> Sauvegarde...';
                $scope.applying = true;
            }

            function abortSubmit() {
                $scope.submitButtonText = 'Appliquer';
                $scope.applying = false;
            }

            function prepareModalScopeForErrorMessages() {
                return $rootScope.$new(true);
            }

            function showErrorMessages() {

                var modalScope = prepareModalScopeForErrorMessages();

                modalScope.errors = WorkspaceMetadataService.metadataErrors;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/error-messages-modal.html'
                });
            }

            var deregisterFileImageSelectModal = $rootScope.$on('browserSelectedElements-fileImageSelectModal', function ($event, elements) {

                $scope.metadata.image = elements[0].path;
                $scope.image = Content.getThumbUrlWithKey(elements[0].key, 180, true);
                $scope.fileImageSelectModal.hide();
            });

            $scope.applyChange = function () {
                startSubmit();
                $scope.submitForm();
            };

            $scope.submitForm = function () {
                WorkspaceMetadataService.save().then(function () {
                    $scope.applying = false;
                    $location.search('section', 'preview');
                }, function () {
                    abortSubmit();
                    WorkspaceMetadataService.metadataErrors.metadataFormat = true;
                    showErrorMessages();
                });
            };

            $scope.$on('$destroy', function () {
                deregisterFileImageSelectModal();
            });

            $rootScope.$on('workspace.metadata.errors', function () {
                abortSubmit();
                showErrorMessages();
            });

            $scope.$watch('ortolangItemJsonform.$pristine', function () {
                if ($scope.ortolangItemJsonform.$pristine === false) {
                    WorkspaceMetadataService.metadataChanged = true;
                }
            }, true);

            function init() {
                $scope.submitButtonText = 'Appliquer';
                // $scope.errors = {title: false, type: false, description: false};
                $scope.tab = {activeTab : 0};
                $scope.WorkspaceMetadataService = WorkspaceMetadataService;

                // Gets last schema
                MetadataFormatResource.get({name: 'ortolang-item-json'}, function (metadataFormats) {
                    var entries = metadataFormats.entries;
                    if(entries.length>0) {
                        // $scope.format = entries[0];
                        WorkspaceMetadataService.format = entries[0];
                    }
                });

                if (Workspace.active.metadata !== null) {
                    $scope.metadata = angular.copy(Workspace.active.metadata);
                    OrtolangIitemJsonMigration.migrate($scope.metadata);
                } else {
                    //TODO Gets schema url from MetadataFormat
                    $scope.metadata = {
                        schema: 'http://www.ortolang.fr/schema/016#',
                        title: [
                            {
                                lang: 'fr',
                                value: Workspace.active.workspace.name
                            }
                        ]
                    };
                }
                WorkspaceMetadataService.metadata = $scope.metadata;
                WorkspaceMetadataService.canEdit = Workspace.active.workspace.readOnly && !User.isRoot();

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
                    templateUrl: 'common/directives/file-select-modal-template.html',
                    show: false
                });

                // Sets image
                if ($scope.metadata.image) {
                    ObjectResource.element({key: Workspace.active.workspace.head, path: $scope.metadata.image}).$promise.then(function (oobject) {
                        $scope.image = Content.getThumbUrlWithKey(oobject.key, 180, true);
                    });
                } else {
                    $scope.imgtitle = 'Cliquez pour ajouter votre logo';
                    $scope.imgtheme = 'ortolang';
                }

            }
            init();
        }]);
