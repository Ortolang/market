'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$rootScope', '$filter', '$location', '$modal', '$alert', '$translate', '$window', '$q', 'AtmosphereService', 'WorkspaceResource', 'WorkspaceElementResource', 'ObjectResource', 'WorkspaceBrowserService', 'GroupResource', 'ProfileResource', 'DownloadResource', 'MetadataFormatResource', 'Settings', 'User', 'Runtime', 'icons', 'url', function ($scope, $rootScope, $filter, $location, $modal, $alert, $translate, $window, $q, AtmosphereService, WorkspaceResource, WorkspaceElementResource, ObjectResource, WorkspaceBrowserService, GroupResource, ProfileResource, DownloadResource, MetadataFormatResource, Settings, User, Runtime, icons, url) {

        var modalScope, workspaceListDeferred;

        function getWorkspaceList() {
            workspaceListDeferred = WorkspaceResource.get(function (data) {
                $scope.workspaceList = data;
            });
            return workspaceListDeferred;
        }

        function getWorkspaceMembers() {
            $scope.workspaceMembers = GroupResource.get({key: WorkspaceBrowserService.workspace.members});
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

        function getPresentationMetadata(workspace) {
            WorkspaceElementResource.get({wskey: workspace.key, path: '/', metadata: 'ortolang-item-json'}, function (data) {
                $scope.presentationMetadata = ObjectResource.download({key: data.key}, function (metadata) {
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

        $scope.changeWorkspace = function (workspace, init) {
            if (init || !$scope.isActiveWorkspace(workspace)) {
                $location.search('alias', workspace.alias);
                WorkspaceBrowserService.workspace = workspace;
                ProfileResource.getCard({key: WorkspaceBrowserService.workspace.author}, function (data) {
                    WorkspaceBrowserService.workspace.authorCard = data;
                });
                getWorkspaceMembers(workspace.members);
                getHead();
                $scope.browserSettings.wskey = workspace.key;
                Settings.store();
                $scope.contentLink = url.content + '/all/' + workspace.alias + '/head';
                $scope.contentLink2 = url.content + '/latest/' + workspace.alias;
                //getPresentationMetadata(workspace);
            }
        };

        $scope.$on('$destroy', function () {
            $rootScope.browsing = false;
            $rootScope.noFooter = false;
        });

        $scope.$on('$routeUpdate', function () {
            if ($location.search().browse) {
                $rootScope.browsing = true;
            }
        });

        $rootScope.$on('core.workspace.create', function (event, eventMessage) {
            workspaceListDeferred.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {key: eventMessage.fromObject});
                if (workspace.length !== 1) {
                    getWorkspaceList();
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('core.workspace.snapshot', function (event, eventMessage) {
            // refresh the whole workspace list as snapshots name are only found in the WorkspaceRepresentation
            getWorkspaceList().$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {key: WorkspaceBrowserService.workspace.key});
                if (workspace.length === 1) {
                    WorkspaceBrowserService.workspace = workspace[0];
                    $scope.getSnapshotsHistory();
                }
            });
            event.stopPropagation();
        });

        $rootScope.$on('membership.group.add-member', function (event, eventMessage) {
            workspaceListDeferred.$promise.then(function () {
                var member = $filter('filter')($scope.workspaceList.entries, {members: eventMessage.fromObject});
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
        };

        // *********************** //
        //          Edit           //
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
                if ($scope.hasPresentationMetadata()) {
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
        //        Snapshot         //
        // *********************** //

        $scope.snapshot = function () {
            WorkspaceResource.get({wskey: WorkspaceBrowserService.workspace.key}).$promise.then(function (data) {
                WorkspaceBrowserService.workspace = data;
                if (data.changed) {
                    var snapshotModal;
                    createModalScope();
                    modalScope.wsName = WorkspaceBrowserService.workspace.name;
                    modalScope.snapshotname = 'Version ' + WorkspaceBrowserService.workspace.clock;
                    modalScope.snapshot = function () {
                        WorkspaceResource.snapshots({wskey: WorkspaceBrowserService.workspace.key}, {snapshotname: modalScope.snapshotname}, function () {
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

        $scope.editPresentationMetadata = function () {
            $scope.editingPresentationMetadata = true;
        };
        //$scope.editingPresentationMetadata = true;

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
                                    function (reason) {
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

        $scope.hasPresentationMetadata = function () {
            return $scope.head && $filter('filter')($scope.head.metadatas, {'name': 'ortolang-item-json'}).length > 0;
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
        $scope.addMember();

        // *********************** //
        //          Resize         //
        // *********************** //

        $scope.resizeBrowser = function () {
            if (!$rootScope.browsing) {
                console.log('Resizing browser');
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

        function initialSubscriptions(data) {
            AtmosphereService.addFilter({typePattern: 'core\\.workspace\\.create', throwedByPattern: User.key});
            angular.forEach(User.groups, function (group) {
                AtmosphereService.addFilter({typePattern: 'core\\.workspace\\.snapshot', argumentsPatterns: {group: group}});
            });
            angular.forEach(data.entries, function (workspace) {
                AtmosphereService.addFilter({typePattern: 'core\\.workspace\\.update', fromPattern: workspace.key});
            });
        }

        function init() {
            $rootScope.browsing = !!$location.search().browse;
            $scope.browserCtrlInitialized = false;
            $scope.WorkspaceBrowserService = WorkspaceBrowserService;
            $scope.workspaceHistory = undefined;
            $rootScope.noFooter = true;
            $scope.resizeBrowser();
            $scope.icons = icons;
            $scope.locationOrigin = $window.location.origin;
            getWorkspaceList();
            var workspace;
            $scope.browserSettings = Settings[WorkspaceBrowserService.id];
            workspaceListDeferred.$promise.then(function (data) {
                initialSubscriptions(data);
                if ($scope.browserSettings.wskey) {
                    var filteredWorkspace = [];
                    if ($location.search().alias) {
                        filteredWorkspace = $filter('filter')(data.entries, {alias: $location.search().alias}, true);
                        if (filteredWorkspace.length !== 1) {
                            displaySearchErrorModal('ALIAS', {alias: $location.search().alias});
                        }
                    }
                    if (filteredWorkspace.length !== 1) {
                        filteredWorkspace = $filter('filter')(data.entries, {key: $scope.browserSettings.wskey}, true);
                    }
                    if (filteredWorkspace.length !== 1) {
                        console.error('No workspace with key "%s" available', $scope.browserSettings.wskey);
                        workspace = data.entries[0];
                    } else {
                        workspace = filteredWorkspace[0];
                    }
                } else {
                    workspace = data.entries[0];
                }
                if (workspace) {
                    $scope.changeWorkspace(workspace, true);
                    //getPresentationMetadata(workspace);
                    if ($rootScope.browsing) {
                        $scope.browserCtrlInitialized = true;
                    }
                } else {
                    $scope.browserSettings.wskey = undefined;
                    Settings.store();
                }
            });
        }
        init();
    }]);
