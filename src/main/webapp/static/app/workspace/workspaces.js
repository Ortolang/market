'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$rootScope', '$filter', '$location', '$modal', '$translate', 'AtmosphereService', 'WorkspaceResource', 'WorkspaceElementResource', 'ObjectResource', 'WorkspaceBrowserService', 'GroupResource', 'DownloadResource', 'Settings', 'Runtime', 'icons', function ($scope, $rootScope, $filter, $location, $modal, $translate, AtmosphereService, WorkspaceResource, WorkspaceElementResource, ObjectResource, WorkspaceBrowserService, GroupResource, DownloadResource, Settings, Runtime, icons) {

        var modalScope;

        function getWorkspaceList(refresh) {
            $scope.workspaceList = WorkspaceResource.get();
            if (!refresh) {
                var workspace;
                $scope.browserSettings = Settings[WorkspaceBrowserService.id];
                $scope.workspaceList.$promise.then(function (data) {
                    AtmosphereService.addFilter({typePattern: 'core\\.workspace\\.create'});
                    angular.forEach(data.entries, function (workspace) {
                        AtmosphereService.addFilter({
                            typePattern: 'core\\.workspace\\.update',
                            fromPattern: workspace.key
                        });
                    });
                    if ($scope.browserSettings.wskey || $scope.forceWorkspace) {
                        var key = $scope.forceWorkspace || $scope.browserSettings.wskey,
                            filteredWorkspace = [];
                        if ($location.search().alias) {
                            filteredWorkspace = $filter('filter')(data.entries, {alias: $location.search().alias}, true);
                            if (filteredWorkspace.length !== 1) {
                                $scope.displaySearchErrorModal('ALIAS', {alias: $location.search().alias});
                            }
                        }
                        if (filteredWorkspace.length !== 1) {
                            filteredWorkspace = $filter('filter')(data.entries, {key: key}, true);
                        }
                        if (filteredWorkspace.length !== 1) {
                            console.error('No workspace with key "%s" available', key);
                            workspace = data.entries[0];
                        } else {
                            workspace = filteredWorkspace[0];
                        }
                    } else {
                        workspace = data.entries[0];
                    }
                    if (workspace) {
                        WorkspaceBrowserService.workspace = workspace;
                        getWorkspaceMembers(workspace.members);
                        $scope.$broadcast('initWorkspaceVariables');
                        //getPresentationMetadata(workspace);
                    } else {
                        $scope.resizeBrowser();
                    }
                });
            }
        }

        function getWorkspaceMembers(groupKey) {
            $scope.workspaceMembers = GroupResource.get({key: groupKey});
        }

        function getPresentationMetadata(workspace) {
            WorkspaceElementResource.get({wskey: workspace.key, path: '/', metadata: 'ortolang-item-json'}, function (data) {
                $scope.presentationMetadata = ObjectResource.download({oKey: data.key}, function (metadata) {
                    if (metadata.image) {
                        $scope.imageUrl = DownloadResource.getDownloadUrl({wskey: workspace.key, path: metadata.image});
                        $scope.imageTitle = undefined;
                        $scope.imageTheme = undefined;
                        console.log($scope.imageUrl);
                    } else {
                        $scope.imageUrl = undefined;
                        $scope.imageTitle = metadata.title.substring(0, 2);
                        $scope.imageTheme = metadata.title.substring(0, 1).toLowerCase();
                    }
                });
            });
        }

        $scope.isActiveWorkspace = function (workspace) {
            return WorkspaceBrowserService.workspace.key === workspace.key;
        };

        $scope.changeWorkspace = function (workspace) {
            if (!$scope.isActiveWorkspace(workspace)) {
                WorkspaceBrowserService.workspace = workspace;
                getWorkspaceMembers(workspace.members);
                //getPresentationMetadata(workspace);
            }
        };

        $scope.$on('$destroy', function () {
            $rootScope.browsing = false;
            $rootScope.noFooter = false;
        });

        $rootScope.$on('core.workspace.create', function (event, eventMessage) {
            $scope.workspaceList.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {key: eventMessage.fromObject});
                if (!workspace || workspace.length !== 1) {
                    getWorkspaceList(true);
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('membership.group.add-member', function (event, eventMessage) {
            $scope.workspaceList.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {members: eventMessage.fromObject});
                if (!workspace || workspace.length !== 1) {
                    getWorkspaceList(true);
                }
            });
            event.stopPropagation();
        });

        $scope.browse = function () {
            $scope.browserCtrlInitialized = true;
            $rootScope.browsing = true;
        };

        function createModalScope() {
            modalScope = $scope.$new(true);
            modalScope.$on('modal.hide', function () {
                modalScope.$destroy();
            });
        }

        // *********************** //
        //     Create Workspace    //
        // *********************** //

        $scope.createWorkspace = function () {
            if (WorkspaceBrowserService.canAdd) {
                var createWorkspaceModal,
                    regExp = new RegExp(' +', 'g');
                createModalScope();
                modalScope.submit = function (createWorkspaceForm) {
                    if (createWorkspaceForm.$valid) {
                        WorkspaceResource.getAvailability({alias: modalScope.alias}, function (data) {
                            if (data.available) {
                                WorkspaceResource.createWorkspace({name: modalScope.name, alias: modalScope.alias, type: 'user'}, function (newWorkspace) {
                                    $scope.$emit('core.workspace.create', {fromObject: newWorkspace.key});
                                    $scope.changeWorkspace(newWorkspace);
                                    createWorkspaceModal.hide();
                                });
                            } else {
                                createWorkspaceForm.alias.$setValidity('availability', false);
                                modalScope.checked = false;
                            }
                        });
                    }
                };
                modalScope.checked = true;
                modalScope.normalizeAlias = function (alias, createWorkspaceForm) {
                    modalScope.alias = alias ? alias.replace(regExp, '-').toLowerCase() : alias;
                    if (!modalScope.checked && createWorkspaceForm) {
                        createWorkspaceForm.alias.$setValidity('availability', true);
                    }
                };
                modalScope.generateAlias = function () {
                    if (modalScope.checked) {
                        modalScope.normalizeAlias(modalScope.name);
                    }
                };
                modalScope.$watch('name', function () {
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
            }
        };

        // *********************** //
        //       Publication       //
        // *********************** //

        $scope.publish = function () {
            var publishModal;
            createModalScope();
            modalScope.wsName = WorkspaceBrowserService.workspace.name;
            modalScope.publish = function () {
                Runtime.createProcess({
                    'process-type': 'publish-workspace',
                    'process-name': 'Publication of workspace: ' + $scope.browserService.workspace.name + ' (version ' + ($scope.browserService.workspace.snapshots.length + 1) + ')',
                    'wskey': $scope.browserService.workspace.key
                });
                publishModal.hide();
            };
            publishModal = $modal({
                scope: modalScope,
                template: 'workspace/templates/publish-modal.html',
                show: true
            });
        };

        // *********************** //
        //          Member         //
        // *********************** //

        $scope.addMember = function () {
            var addMemberModal;
            createModalScope();
            modalScope.wsName = WorkspaceBrowserService.workspace.name;
            modalScope.add = function (profile) {
                GroupResource.addMember({key: WorkspaceBrowserService.workspace.members}, profile, function (data) {
                    $scope.workspaceMembers = data;
                });
                addMemberModal.hide();
            };
            addMemberModal = $modal({
                scope: modalScope,
                template: 'workspace/templates/add-member-modal.html',
                show: true
            });
        };

        function init() {
            getWorkspaceList(false);
            $scope.WorkspaceBrowserService = WorkspaceBrowserService;
            $scope.browserCtrlInitialized = true;
            $rootScope.browsing = true;
            $rootScope.noFooter = true;
            $scope.icons = icons;
        }
        init();
    }]);
