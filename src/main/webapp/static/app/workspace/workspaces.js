'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$location', '$modal', '$translate', 'Workspace', 'WorkspaceResource', 'Helper', function ($scope, $location, $modal, $translate, Workspace, WorkspaceResource, Helper) {

        var modalScope;

        // *********************** //
        //     Create Workspace    //
        // *********************** //

        function createModalScope() {
            modalScope = $scope.$new(true);
            modalScope.models = {};
            modalScope.$on('modal.hide', function () {
                modalScope.$destroy();
            });
        }

        $scope.createWorkspace = function () {
            var createWorkspaceModal,
                regExp = new RegExp(' +', 'g');
            createModalScope();
            modalScope.submit = function (createWorkspaceForm) {
                modalScope.models.pendingSubmit = true;
                if (createWorkspaceForm.$valid) {
                    WorkspaceResource.checkAliasAvailability({alias: modalScope.models.alias}, function (data) {
                        if (data.available) {
                            WorkspaceResource.createWorkspace({name: modalScope.models.name, alias: modalScope.models.alias, type: 'user'}, function (newWorkspace) {
                                $scope.$emit('core.workspace.create', {fromObject: newWorkspace.key});
                                createWorkspaceModal.hide();
                            });
                        } else {
                            createWorkspaceForm.alias.$setValidity('availability', false);
                            modalScope.models.checked = false;
                            modalScope.models.pendingSubmit = false;
                        }
                    });
                }
            };
            modalScope.models.checked = true;
            modalScope.normalizeAlias = function (alias, createWorkspaceForm) {
                modalScope.models.alias = alias ? alias.replace(regExp, '-').toLowerCase() : alias;
                if (!modalScope.models.checked && createWorkspaceForm) {
                    createWorkspaceForm.alias.$setValidity('availability', true);
                }
            };
            modalScope.generateAlias = function () {
                if (modalScope.models.checked) {
                    modalScope.normalizeAlias(modalScope.models.name);
                }
            };
            modalScope.$watch('models.name', function () {
                modalScope.generateAlias();
            });
            modalScope.$on('modal.show', function () {
                angular.element('#create-workspace-modal').find('[autofocus]:first').focus();
            });
            createWorkspaceModal = $modal({
                scope: modalScope,
                template: 'workspace/templates/create-workspace-modal.html',
                show: true
            });
        };

        $scope.manageWorkspace = function ($event, workspace, section) {
            $event.stopPropagation();
            $location.url('/workspaces/' + workspace.alias + (section ? '?section=' + section : ''));
        };

        $scope.getTitleValue = function (workspace) {
            var metadata = Workspace.metadatas[workspace.alias];
            if (metadata === null) {
                return workspace.name;
            }
            if (metadata === undefined) {
                return undefined;
            }
            if (metadata.title) {
                return Helper.getMultilingualValue(metadata.title);
            }
        };


        function init() {
            $scope.Workspace = Workspace;
            Workspace.getWorkspaceList().then(function () {
                Workspace.getWorkspacesMetadata();
            });
            $scope.models = {};
        }

        init();

    }]);
