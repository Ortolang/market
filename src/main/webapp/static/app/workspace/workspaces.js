'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$rootScope', '$filter', '$location', '$modal', '$alert', '$translate', '$window', '$q', 'WorkspaceResource', 'WorkspaceElementResource', 'ObjectResource', 'WorkspaceBrowserService', 'GroupResource', 'ProfileResource', 'Content', 'MetadataFormatResource', 'Settings', 'Runtime', 'icons', function ($scope, $rootScope, $filter, $location, $modal, $alert, $translate, $window, $q, WorkspaceResource, WorkspaceElementResource, ObjectResource, WorkspaceBrowserService, GroupResource, ProfileResource, Content, MetadataFormatResource, Settings, Runtime, icons) {

        var modalScope, workspaceListDeferred, workspaceMembersDeferred;

        function getWorkspaceList() {
            workspaceListDeferred = WorkspaceResource.get(function (data) {
                $scope.workspaceList = $filter('orderBy')(data.entries, '+name');
            });
            return workspaceListDeferred;
        }

        function getWorkspaceMembers() {
            workspaceMembersDeferred = GroupResource.get({key: WorkspaceBrowserService.workspace.members}, function (data) {
                $scope.workspaceMembers = data.members;
            });
        }

        function getHead() {
            return ObjectResource.get({key: WorkspaceBrowserService.workspace.head}, function (data) {
                $scope.head = data.object;
                $scope.workspaceHistory = data.history;
                $scope.lastPublishedSnapshot = $scope.workspaceHistory.length > 1 ? $scope.workspaceHistory[1] : undefined;
                angular.forEach($scope.workspaceHistory, function (workspaceSnapshot) {
                    ProfileResource.getCard({key: workspaceSnapshot.author}, function (data) {
                        workspaceSnapshot.authorCard = data;
                    });
                    workspaceSnapshot.number = getSnapshotNumberFromHistory(workspaceSnapshot);
                });
                loadMetadataItem();
            });
        }

        function refreshWorkspace() {
            WorkspaceResource.get({wskey: WorkspaceBrowserService.workspace.key}, function (workspace) {
                workspace.authorCard = WorkspaceBrowserService.workspace.authorCard;
                WorkspaceBrowserService.workspace = workspace;
                ProfileResource.getCard({key: WorkspaceBrowserService.workspace.author}, function (data) {
                    WorkspaceBrowserService.workspace.authorCard = data;
                });
            });
        }

        $scope.isActiveWorkspace = function (workspace) {
            return WorkspaceBrowserService.workspace.key === workspace.key;
        };

        $scope.changeWorkspace = function (workspace, init) {
            if (init || !$scope.isActiveWorkspace(workspace)) {
                $location.search('alias', workspace.alias);
                $location.search('preview', $scope.previewing || undefined);
                $location.search('edit', $scope.editing || undefined);

                WorkspaceBrowserService.workspace = workspace;
                ProfileResource.getCard({key: WorkspaceBrowserService.workspace.author}, function (data) {
                    WorkspaceBrowserService.workspace.authorCard = data;
                });
                getWorkspaceMembers();
                $scope.browserSettings.wskey = workspace.key;
                Settings.store();
                $scope.contentLink = Content.getContentUrlWithPath('', workspace.alias);
                $scope.marketLink = '#/market/item/' + WorkspaceBrowserService.workspace.alias;
                $scope.marketLinkFull = $window.location.origin + '/' + $scope.marketLink;
            }
        };

        // *********************** //
        //         Events          //
        // *********************** //

        $scope.$on('$destroy', function () {
            $rootScope.browsing = false;
            $rootScope.noFooter = false;
            $rootScope.myWorkspaces = undefined;
        });

        $scope.$on('$routeUpdate', function () {
            if ($location.search().browse) {
                $rootScope.browsing = true;
            }
            $scope.previewing = !!$location.search().preview;
            $scope.editing = !!$location.search().edit;
            $scope.creating = !!$location.search().create;
        });

        $rootScope.$on('core.workspace.create', function (event, eventMessage) {
            workspaceListDeferred.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList, {key: eventMessage.fromObject});
                if (workspace.length !== 1) {
                    getWorkspaceList();
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('core.workspace.delete', function (event, eventMessage) {
            workspaceListDeferred.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList, {key: eventMessage.fromObject});
                if (workspace.length === 1) {
                    getWorkspaceList();
                    workspaceListDeferred.$promise.then(function () {
                        if ($scope.workspaceList.length > 0) {
                            if (WorkspaceBrowserService.workspace.key === eventMessage.fromObject) {
                                $scope.changeWorkspace($scope.workspaceList[0]);
                            }
                        } else {
                            WorkspaceBrowserService.workspace = undefined;
                        }
                    });
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('core.workspace.snapshot', function (event) {
            // refresh the whole workspace list as snapshots name are only found in the WorkspaceRepresentation
            getWorkspaceList().$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList, {key: WorkspaceBrowserService.workspace.key});
                if (workspace.length === 1) {
                    WorkspaceBrowserService.workspace = workspace[0];
                    $scope.getSnapshotsHistory();
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('membership.group.add-member', function (event, eventMessage) {
            workspaceListDeferred.$promise.then(function () {
                var member = $filter('filter')($scope.workspaceList, {members: eventMessage.fromObject});
                if (member.length !== 1) {
                    getWorkspaceList();
                }
            });
            event.stopPropagation();
        });

        function displaySearchErrorModal(cause, params) {
            $modal({
                title: $translate.instant('WORKSPACE.SEARCH_ERROR_MODAL.TITLE'),
                content: $translate.instant('WORKSPACE.SEARCH_ERROR_MODAL.BODY_' + cause, params),
                show: true
            });
        }

        $scope.toggleBrowsing = function () {
            $rootScope.browsing = !$rootScope.browsing;
            $location.search('browse', $rootScope.browsing || undefined);
            if (!$rootScope.browsing) {
                refreshWorkspace();
                $location.search('root', undefined);
                $location.search('path', undefined);
            }
            if (!$scope.browserCtrlInitialized) {
                $scope.browserCtrlInitialized = true;
            } else if ($rootScope.browsing) {
                $scope.$broadcast('initWorkspaceVariables');
            }
        };

        function createModalScope() {
            modalScope = $scope.$new(true);
            modalScope.models = {};
            modalScope.$on('modal.hide', function () {
                modalScope.$destroy();
            });
        }

        // *********************** //
        //     Create Workspace    //
        // *********************** //

        $scope.createWorkspace = function () {
            var createWorkspaceModal,
                regExp = new RegExp(' +', 'g');
            createModalScope();
            modalScope.submit = function (createWorkspaceForm) {
                if (createWorkspaceForm.$valid) {
                    WorkspaceResource.checkAliasAvailability({alias: modalScope.models.alias}, function (data) {
                        if (data.available) {
                            WorkspaceResource.createWorkspace({name: modalScope.models.name, alias: modalScope.models.alias, type: 'user'}, function (newWorkspace) {
                                $scope.$emit('core.workspace.create', {fromObject: newWorkspace.key});
                                $scope.changeWorkspace(newWorkspace);
                                createWorkspaceModal.hide();
                            });
                        } else {
                            createWorkspaceForm.alias.$setValidity('availability', false);
                            modalScope.models.checked = false;
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

        // *********************** //
        //     Rename Workspace    //
        // *********************** //

        $scope.renameWorkspace = function ($data) {
            if ($data.trim().length === 0) {
                return false;
            }
            if ($data !== WorkspaceBrowserService.workspace.name) {
                var data = angular.copy(WorkspaceBrowserService.workspace),
                    deferred = $q.defer(),
                    nameCopy = WorkspaceBrowserService.workspace.name;
                delete data.authorCard;
                data.name = $data;
                WorkspaceResource.updateWorkspace({wskey: WorkspaceBrowserService.workspace.key}, data, function () {
                    deferred.resolve();
                    getWorkspaceList();
                    refreshWorkspace();
                }, function () {
                    WorkspaceBrowserService.workspace.name = nameCopy;
                    deferred.reject($translate.instant('UNEXPECTED_ERROR_ALERT.CONTENT'));
                });
                return deferred.promise;
            }
        };

        // *********************** //
        //       Publication       //
        // *********************** //

        $scope.publish = function () {
            getHead().$promise.then(function () {
                if (hasPresentationMetadata()) {
                    var publishModal;
                    createModalScope();
                    modalScope.wsName = WorkspaceBrowserService.workspace.name;
                    modalScope.publish = function () {
                        Runtime.createProcess({
                            'process-type': 'publish-workspace',
                            'process-name': 'Publication of workspace: ' + WorkspaceBrowserService.workspace.name + ' (version ' + (WorkspaceBrowserService.workspace.snapshots.length + 1) + ')',
                            'wskey': WorkspaceBrowserService.workspace.key
                        });
                        publishModal.hide();
                    };
                    publishModal = $modal({
                        scope: modalScope,
                        template: 'workspace/templates/publish-modal.html',
                        show: true
                    });
                } else {
                    // TODO Add alert
                }
            });
        };

        // *********************** //
        //        Deletion         //
        // *********************** //

        $scope.deleteWorkspace = function () {
            var deleteWorkspaceModal;
            createModalScope();
            modalScope.wsName = WorkspaceBrowserService.workspace.name;
            modalScope.delete = function () {
                WorkspaceResource.delete({wskey: WorkspaceBrowserService.workspace.key}).$promise.then(function (data) {
                    $rootScope.$emit('process-created', data);
                });
                deleteWorkspaceModal.hide();
            };
            deleteWorkspaceModal = $modal({
                scope: modalScope,
                template: 'workspace/templates/delete-workspace-modal.html',
                show: true
            });
        };

        // *********************** //
        //        Snapshot         //
        // *********************** //

        $scope.snapshot = function () {
            WorkspaceResource.get({wskey: WorkspaceBrowserService.workspace.key}).$promise.then(function (data) {
                WorkspaceBrowserService.workspace = data;
                if (data.changed) {
                    var snapshotModal;
                    createModalScope();
                    modalScope.wsName = WorkspaceBrowserService.workspace.name;
                    modalScope.snapshot = function () {
                        WorkspaceResource.snapshots({wskey: WorkspaceBrowserService.workspace.key}, function () {
                            snapshotModal.hide();
                            $scope.getSnapshotsHistory();
                        });
                    };
                    modalScope.$on('modal.show', function () {
                        angular.element('#snapshot-workspace-form').find('[autofocus]:first').focus();
                    });
                    snapshotModal = $modal({
                        scope: modalScope,
                        template: 'workspace/templates/snapshot-modal.html',
                        show: true
                    });
                } else {
                    $alert({
                        title: $translate.instant('WORKSPACE.SNAPSHOT_ALERT.TITLE'),
                        content: $translate.instant('WORKSPACE.SNAPSHOT_ALERT.CONTENT'),
                        type: 'warning',
                        duration: 5,
                        dismissable: false
                    });
                }
            });
        };

        function getSnapshotNumberFromHistory(workspaceSnapshot) {
            if (WorkspaceBrowserService.workspace.snapshots) {
                var filteredSnapshot = $filter('filter')(WorkspaceBrowserService.workspace.snapshots, {key: workspaceSnapshot.key}, true);
                if (filteredSnapshot.length === 1) {
                    return filteredSnapshot[0].name;
                }
            }
            return undefined;
        }

        $scope.getSnapshotsHistory = function () {
            getHead();
        };

        // *********************** //
        //        Metadata         //
        // *********************** //

        function hasPresentationMetadata() {
            return $scope.head && $filter('filter')($scope.head.metadatas, {'name': 'ortolang-item-json'}).length > 0;
        }

        function loadMetadataItem() {
            var itemMetadata = $filter('filter')($scope.head.metadatas, {name: 'ortolang-item-json'});
            if (itemMetadata.length === 1) {
                Content.downloadWithKey(itemMetadata[0].key).promise.success(function (data) {
                    $scope.metadataItem = angular.fromJson(data);
                    $scope.itemKey = WorkspaceBrowserService.workspace.head;
                    $scope.metadataItemLoaded = true;
                });
            } else {
                $scope.metadataItem = undefined;
                $scope.itemKey = undefined;
                $scope.metadataItemLoaded = true;
            }
        }

        $scope.showMetadataItem = function () {
            //TODO pre load metadataFormat
            MetadataFormatResource.get({name: 'ortolang-item-json'}).$promise.then(
                function (data) {
                    if (data.entries.length > 0) {
                        var entry = data.entries[0];
                        MetadataFormatResource.download({name: 'ortolang-item-json'}).$promise.then(
                            function (schema) {
                                entry.schemaContent = schema;
                                entry.view = 'workspace/metadata-form-schema.html';
                                entry.displayed = false;

                                // $scope.metadataFormats.push(entry);
                                WorkspaceElementResource.get({wskey: WorkspaceBrowserService.workspace.key, path: '/', metadata: 'ortolang-item-json'}).$promise.then(
                                    function (data) {
                                        $rootScope.$broadcast('metadata-editor-edit', entry, data);
                                    },
                                    function () {
                                        $rootScope.$broadcast('metadata-editor-show', entry);
                                    }
                                );
                            },
                            function (reason) {
                                console.error('Cant get schema of metadata formats ' + entry.name + ' ; failed cause ' + reason + ' !');
                            }
                        );
                    }
                },
                function (reason) {
                    console.error('Cant get metadata formats for item ; failed cause ' + reason + ' !');
                }
            );
        };

        $scope.editMetadataItem = function () {
            var entry = {view: 'workspace/templates/metadata-item-form.html', name: 'ortolang-item-json'};
            if (hasPresentationMetadata()) {
                $rootScope.$broadcast('metadata-editor-edit', entry, $scope.metadataItem);
            } else {
                $rootScope.$broadcast('metadata-editor-show', entry);
            }
        };

        $scope.togglePreviewing = function () {
            $scope.previewing = !$scope.previewing;
            $location.search('preview', $scope.previewing || undefined);
        };

        $scope.toggleEditing = function () {
            $scope.editing = !$scope.editing;
            $location.search('edit', $scope.editing || undefined);
        };

        $scope.toggleCreating = function () {
            $scope.creating = !$scope.creating;
            $location.search('create', $scope.creating || undefined);
        };

        $scope.createMetadataItem = function () {
            $scope.itemKey = WorkspaceBrowserService.workspace.head;
            $scope.toggleCreating();
        };

        // *********************** //
        //          Member         //
        // *********************** //

        $scope.addMember = function () {
            workspaceMembersDeferred.$promise.then(function () {
                var addMemberModal;
                createModalScope();
                modalScope.wsName = WorkspaceBrowserService.workspace.name;
                modalScope.members = $scope.workspaceMembers;
                modalScope.add = function (profile) {
                    GroupResource.addMember({key: WorkspaceBrowserService.workspace.members}, profile, function (data) {
                        $scope.workspaceMembers = data.members;
                    });
                    addMemberModal.hide();
                };
                addMemberModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/add-member-modal.html',
                    show: true
                });
            });
        };

        // *********************** //
        //          Resize         //
        // *********************** //

        $scope.resizeBrowser = function () {
            if (!$rootScope.browsing) {
                var topOffset = angular.element('#top-nav-wrapper').outerHeight(),
                    height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
                    browserToolbarHeight = angular.element('.browser-toolbar').innerHeight();
                height -= topOffset;
                if (height < 1) {
                    height = 1;
                }
                if (height > topOffset) {
                    height -= 1;
                    if ($rootScope.uploader && $rootScope.uploader.uploadQueueStatus === 'active') {
                        height -= angular.element('.upload-queue').innerHeight();
                    }
                    angular.element('.browser-aside-left').css('min-height', (height - browserToolbarHeight) + 'px');
                }
            }
        };

        angular.element($window).bind('resize', function () {
            $scope.resizeBrowser();
        });

        function init() {
            $rootScope.browsing = !!$location.search().browse;
            $rootScope.noFooter = true;
            $rootScope.myWorkspaces = true;

            $scope.browserCtrlInitialized = false;
            $scope.WorkspaceBrowserService = WorkspaceBrowserService;
            $scope.workspaceHistory = undefined;
            $scope.resizeBrowser();
            $scope.icons = icons;

            $scope.previewing = !!$location.search().preview;
            $scope.editing = !!$location.search().edit;
            $scope.creating = !!$location.search().create;
            $scope.metadataItemLoaded = false;

            getWorkspaceList();
            var workspace;
            $scope.browserSettings = Settings[WorkspaceBrowserService.id];
            workspaceListDeferred.$promise.then(function () {
                if ($location.search().alias || $scope.browserSettings.wskey) {
                    var filteredWorkspace = [];
                    if ($location.search().alias) {
                        filteredWorkspace = $filter('filter')($scope.workspaceList, {alias: $location.search().alias}, true);
                        if (filteredWorkspace.length !== 1) {
                            displaySearchErrorModal('ALIAS', {alias: $location.search().alias});
                        }
                    }
                    if (filteredWorkspace.length !== 1) {
                        filteredWorkspace = $filter('filter')($scope.workspaceList, {key: $scope.browserSettings.wskey}, true);
                    }
                    if (filteredWorkspace.length !== 1) {
                        console.error('No workspace with key "%s" available', $scope.browserSettings.wskey);
                        workspace = $scope.workspaceList[0];
                    } else {
                        workspace = filteredWorkspace[0];
                    }
                } else {
                    workspace = $scope.workspaceList[0];
                }
                if (workspace) {
                    $scope.changeWorkspace(workspace, true);
                    if ($rootScope.browsing) {
                        $scope.browserCtrlInitialized = true;
                    }

                } else {
                    $scope.browserSettings.wskey = undefined;
                    $location.search('alias', undefined);
                    Settings.store();
                }
            });
        }
        init();
    }]);
