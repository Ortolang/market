'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardCtrl
 * @description
 * # WorkspaceDashboardCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardCtrl', [
        '$scope',
        '$rootScope',
        '$location',
        '$route',
        '$modal',
        '$translate',
        '$window',
        '$filter',
        'Workspace',
        'Content',
        'Helper',
        'RuntimeResource',
        'WorkspaceResource',
        'WorkspaceBrowserService',
        'WorkspaceMetadataService',
        'User',
        function ($scope, $rootScope, $location, $route, $modal, $translate, $window, $filter, Workspace, Content, Helper, RuntimeResource, WorkspaceResource, WorkspaceBrowserService, WorkspaceMetadataService, User) {

            /**
             * The section selected by default
             * @type {string}
             */
            var defaultSection = 'information';
            var modalScope;

            /**
             *
             * @param {String} newUrl   - the url of the next page; if null or undefined sets default section
             */
            function showSavingMetadataModal(newUrl) {
                if (Workspace.active.workspace.readOnly) {
                    $location.url(newUrl);
                    return;
                }
                var savingMetadataModal;
                modalScope = Helper.createModalScope(true);
                modalScope.save = function () {
                    WorkspaceMetadataService.save().then(function () {
                        $location.url(newUrl);
                    });
                    savingMetadataModal.hide();
                };
                modalScope.exit = function () {
                    savingMetadataModal.hide();
                    WorkspaceMetadataService.metadataChanged = false;
                    $location.url(newUrl);
                };
                savingMetadataModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/save-metadata-modal.html',
                    show: true
                });
            }

            /**
             *
             * @param {String} id   - the section id; if null or undefined sets default section
             */
            function performSetDashboardSection (id) {
                $scope.dashboardSection = id || defaultSection;
                $scope.dashboardSectionSelect = $scope.dashboardSection;
                if ($scope.dashboardSection === defaultSection) {
                    $location.search({});
                } else {
                    if ($scope.dashboardSection === 'content' || $scope.dashboardSection === 'threads') {
                        $location.search('section', id);
                    } else {
                        $location.search({section: id});
                    }
                }
                // Refresh active workspace info
                if ($scope.dashboardSection === 'information') {
                    Workspace.refreshActiveWorkspaceInfo(true);
                }
                // If browsing content
                if (id === 'content') {
                    WorkspaceBrowserService.canEdit = !Workspace.active.workspace.readOnly;
                    WorkspaceBrowserService.workspace = Workspace.active.workspace;
                }
            }

            /**
             *
             * @param {String} id   - the section id; if null or undefined sets default section
             */
            function setDashboardSection(id) {
                if ($location.search().section === 'metadata' && WorkspaceMetadataService.metadataChanged) {
                    showSavingMetadataModal('?section=' + id);
                } else {
                    performSetDashboardSection(id);
                }
            }

            $scope.selectDashboardSection = function (id) {
                setDashboardSection(id);
            };

            $scope.dashboardSections = ['information', 'content', 'members', 'metadata', 'permissions', 'preview'];

            $scope.$on('$routeUpdate', function () {
                if ($scope.dashboardSection === 'information' && !$location.search().section) {
                    return;
                }
                if ($scope.dashboardSection !== $location.search().section) {
                    setDashboardSection($location.search().section);
                }
            });

            $scope.$on('$routeChangeStart', function (event, next, current) {
                if (current.params.section === 'metadata' && WorkspaceMetadataService.metadataChanged) {
                    showSavingMetadataModal($location.$$url);
                    event.preventDefault();
                }
            });

            // *********************** //
            //       Publication       //
            // *********************** //

            $scope.publishWorkspace = function () {
                if (Workspace.active.metadata) {
                    var publishModal;
                    modalScope = Helper.createModalScope(true);
                    modalScope.wsName = Workspace.getActiveWorkspaceTitle();
                    modalScope.models.firstVersion = Workspace.active.workspace.tags.length === 0;
                    modalScope.models.tags = $filter('orderBy')(Workspace.active.workspace.tags, '-name');
                    modalScope.models.customVersionPattern = /^([0-9]+|[0-9]+\.[0-9]+)$/;
                    if (!modalScope.models.firstVersion) {
                        modalScope.models.lastTag = modalScope.models.tags[0];
                        var nextMajorVersion,
                            nextMinorVersion,
                            lastVersion = modalScope.models.tags[0].name;
                        if (isNaN(parseInt(lastVersion.substring(1), 10))) {
                            console.log('Not a number');
                            modalScope.models.customVersionPattern = '';
                            modalScope.models.hideVersionSelector = true;
                            modalScope.models.showCustomVersion = true;
                            modalScope.models.nextTags = [
                                {
                                    label: $translate.instant('WORKSPACE.PUBLISH_MODAL.LABEL.SAME_VERSION', {version: lastVersion.substring(1)}),
                                    value: lastVersion.substring(1)
                                }
                            ];
                        } else {
                            if (lastVersion.indexOf('.') > 0) {
                                nextMajorVersion = parseInt(lastVersion.substring(1, lastVersion.indexOf('.')), 10) + 1;
                            } else {
                                nextMajorVersion = parseInt(lastVersion.substring(1), 10) + 1;
                            }
                            if (lastVersion.lastIndexOf('.') > 0) {
                                nextMinorVersion = lastVersion.substring(1, lastVersion.lastIndexOf('.') + 1) +
                                    (parseInt(lastVersion.substring(lastVersion.lastIndexOf('.') + 1), 10) + 1);
                            } else {
                                nextMinorVersion = lastVersion.substr(1) + '.1';
                            }
                            modalScope.models.nextTags = [
                                {
                                    label: $translate.instant('WORKSPACE.PUBLISH_MODAL.LABEL.NEXT_MAJOR_VERSION', {version: nextMajorVersion}),
                                    value: nextMajorVersion
                                },
                                {
                                    label: $translate.instant('WORKSPACE.PUBLISH_MODAL.LABEL.NEXT_MINOR_VERSION', {version: nextMinorVersion}),
                                    value: nextMinorVersion
                                },
                                {
                                    label: $translate.instant('WORKSPACE.PUBLISH_MODAL.LABEL.SAME_VERSION', {version: lastVersion.substring(1)}),
                                    value: lastVersion.substring(1)
                                }
                            ];
                            modalScope.models.selectedVersion = modalScope.models.nextTags[0];
                        }
                    } else {
                        modalScope.models.nextTags = [
                            {
                                label: $translate.instant('WORKSPACE.PUBLISH_MODAL.LABEL.NEXT_MAJOR_VERSION', {version: 1}),
                                value: 1
                            }
                        ];
                        modalScope.models.selectedVersion = modalScope.models.nextTags[0];
                    }

                    modalScope.submit = function (publishWorkspaceForm) {
                        if (!modalScope.models.pendingSubmit) {
                            modalScope.models.pendingSubmit = true;
                            if (publishWorkspaceForm.$valid) {
                                var wstag;
                                if (modalScope.models.showCustomVersion) {
                                    wstag = modalScope.models.customVersion;
                                } else {
                                    wstag = modalScope.models.selectedVersion.value;
                                }
                                if (wstag) {
                                    RuntimeResource.createProcess({
                                        'process-type': 'publish-workspace',
                                        'process-name': 'Publication of workspace: ' + Workspace.active.workspace.name,
                                        'wskey': Workspace.active.workspace.key,
                                        'wstag': 'v' + wstag
                                    }, function () {
                                        Workspace.refreshActiveWorkspaceInfo().finally(function () {
                                            Workspace.active.workspace.readOnly = true;
                                            publishModal.hide();
                                        });
                                    }, function () {
                                        Helper.showUnexpectedErrorAlert('.modal', 'center');
                                    });
                                }
                            } else {
                                modalScope.models.pendingSubmit = false;
                            }
                        }
                    };
                    publishModal = $modal({
                        scope: modalScope,
                        templateUrl: 'workspace/templates/publish-modal.html',
                        show: true
                    });
                }
            };

            // *********************** //
            //        Deletion         //
            // *********************** //

            $scope.deleteWorkspace = function () {
                var deleteWorkspaceModal;
                modalScope = Helper.createModalScope(true);
                modalScope.wsName = Workspace.active.workspace.name;
                modalScope.delete = function () {
                    WorkspaceResource.delete({wskey: Workspace.active.workspace.key}).$promise.then(function (data) {
                        $rootScope.$emit('process-created', data);
                    });
                    Workspace.deleted = Workspace.active.workspace.key;
                    deleteWorkspaceModal.hide();
                    $location.url('/workspaces');
                    Workspace.clearActiveWorkspace();
                };
                deleteWorkspaceModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/delete-workspace-modal.html',
                    show: true
                });
            };

            $scope.$on('$destroy', function () {
                $rootScope.ortolangPageSubtitle = undefined;
            });

            $scope.showSeeMoreEvents = function () {
                return ($filter('eventFeedFilter')(Workspace.active.events)).length > $scope.dashboardModels.eventsLimit;
            };

            $scope.showSeeMoreRequests = function () {
                return Workspace.active.requests && ($filter('filter')(Workspace.active.requests, {'type': 'publish-workspace'})).length > $scope.dashboardModels.requestsLimit;
            };

            $scope.seeMoreEvents = function () {
                if (!$scope.dashboardModels.eventsInfiniteScrollBusy && !$scope.dashboardModels.eventsEnd) {
                    $scope.dashboardModels.eventsInfiniteScrollBusy = true;
                    if (!$scope.dashboardModels.eventsSeeMoreOnce) {
                        var eventList = angular.element('.workspace-dashboard-section-events').find('ul.list-unstyled');
                        $scope.dashboardModels.eventFeedHeight = eventList.outerHeight() + 'px';
                        $scope.dashboardModels.eventsSeeMoreOnce = true;
                    }
                    if (Workspace.active.events.length < $scope.dashboardModels.eventsLimit) {
                        Workspace.getActiveWorkspaceEvents(true).then(function () {
                            $scope.dashboardModels.eventsLimit += 4;
                            $scope.dashboardModels.eventsInfiniteScrollBusy = false;
                        }, function () {
                            $scope.dashboardModels.eventsEnd = true;
                            $scope.dashboardModels.eventsInfiniteScrollBusy = false;
                        });
                    } else {
                        $scope.dashboardModels.eventsLimit += 4;
                        $scope.dashboardModels.eventsInfiniteScrollBusy = false;
                    }
                }
            };

            $scope.seeMoreRequests = function () {
                if ($scope.dashboardModels.requestsLimit !== null) {
                    if (!$scope.dashboardModels.requestsSeeMoreOnce) {
                        var eventList = angular.element('.workspace-dashboard-section-requests').find('ul.list-unstyled');
                        $scope.dashboardModels.requestsHeight = eventList.outerHeight() + 'px';
                        $scope.dashboardModels.requestsSeeMoreOnce = true;
                    }
                    if ($scope.dashboardModels.requestsLimit + 3 < Workspace.active.requests.length) {
                        $scope.dashboardModels.requestsLimit += 3;
                    } else {
                        $scope.dashboardModels.requestsLimit = null;
                    }
                }
            };

            $scope.showDiff = function () {
                if (Workspace.active.workspace.snapshots.length > 1) {
                    modalScope = Helper.createModalScope(true);
                    modalScope.models = {};
                    modalScope.icons = $rootScope.icons;
                    var tmp = {},
                        lastTag = null;
                    angular.forEach(Workspace.active.workspace.snapshots, function (snapshot) {
                        tmp[snapshot.name] = snapshot;
                    });
                    angular.forEach(Workspace.active.workspace.tags, function (tag) {
                        tmp[tag.snapshot].tag = tag.name;
                        if (!lastTag || tag.snapshot > lastTag.tag) {
                            lastTag = tag;
                        }
                    });
                    modalScope.snapshots = [];
                    angular.forEach(tmp, function (snapshot) {
                        modalScope.snapshots.push(snapshot);
                    });
                    modalScope.tags = Workspace.active.workspace.tags;

                    modalScope.compareCurrentToLast = function () {
                        if (lastTag) {
                            modalScope.models.lsnapshot = lastTag.snapshot;
                            modalScope.models.rsnapshot = 'head';
                            modalScope.selectSnapshot();
                        }
                    };

                    modalScope.selectSnapshot = function () {
                        if (modalScope.models.lsnapshot && modalScope.models.rsnapshot) {
                            WorkspaceResource.diffWorkspaceContent({wskey: Workspace.active.workspace.key, lsnapshot: modalScope.models.lsnapshot, rsnapshot: modalScope.models.rsnapshot}, function (data) {
                                var i, change;
                                for (i = 0; i < data.length; i++) {
                                    change = data[i];
                                    switch (change.type) {
                                        case 'ValueChange':
                                            change.order = 1;
                                            break;
                                        case 'MapChange':
                                            change.order = 2;
                                            break;
                                        case 'NewObject':
                                            change.order = 3;
                                            break;
                                        case 'ObjectRemoved':
                                            change.order = 4;
                                            break;
                                    }
                                }
                                modalScope.diff = data;
                            });
                        } else {
                            modalScope.diff = null;
                        }
                    };
                    $modal({
                        scope: modalScope,
                        templateUrl: 'workspace/templates/diff-modal.html',
                        show: true
                    });
                }
            };

            (function init() {
                if (Workspace.active.workspace && Workspace.active.workspace.alias !== $route.current.params.alias) {
                    Workspace.clearActiveWorkspace();
                }
                $scope.User = User;
                $scope.Helper = Helper;
                $scope.Workspace = Workspace;
                $scope.dashboardModels = {
                    eventsLimit: 3,
                    requestsLimit: 2,
                    eventsInfiniteScrollBusy: false
                };
                Workspace.getWorkspaceList(true).then(function () {
                    $rootScope.ortolangPageSubtitle = $route.current.params.alias + ' | ';
                    Workspace.setActiveWorkspaceFromAlias($route.current.params.alias).then(function () {
                        setDashboardSection($location.search().section);
                        $scope.dashboardModels.links = {
                            base: $window.location.origin,
                            market: '/market/item/' + Workspace.active.workspace.alias,
                            content: Content.getContentUrlWithPath('', Workspace.active.workspace.alias)
                        };
                        Workspace.isActiveWorkspaceInfoLoaded().then(function () {
                            if (Workspace.active.stats.length) {
                                $scope.dashboardModels.chart = {
                                    data: [],
                                    labels: [],
                                    options: {

                                    },
                                    datasetOverride: {
                                        backgroundColor: 'rgba(0,139,208,0.5)',
                                        borderColor: 'rgba(0,139,208,1)',
                                        pointBackgroundColor: 'rgba(255,255,255,1)',
                                        pointHoverBackgroundColor: 'rgba(255,255,255,1)',
                                        borderWidth: 2
                                    },
                                    totalHits: 0,
                                    totalDownloads: 0,
                                    totalSingleDownloads: 0
                                };
                                angular.forEach($filter('orderBy')(Workspace.active.stats, 'timestamp'), function (stat) {
                                    var date = stat.timestamp.toString().slice(0, 4) + '-' + stat.timestamp.toString().slice(4) + '-01';
                                    $scope.dashboardModels.chart.labels.push($filter('date')(date, 'MMM yyyy'));
                                    $scope.dashboardModels.chart.data.push(stat.hits);
                                    $scope.dashboardModels.chart.totalHits += stat.hits;
                                    $scope.dashboardModels.chart.totalDownloads += stat.downloads;
                                    $scope.dashboardModels.chart.totalSingleDownloads += stat.singleDownloads;
                                });
                            }
                        });
                    }, function (error) {
                        Helper.showErrorModal(error.data);
                        $location.url('/workspaces');
                    });
                });
            }());

        }]);
