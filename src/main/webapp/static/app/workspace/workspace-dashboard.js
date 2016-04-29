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
        'User',
        function ($scope, $rootScope, $location, $route, $modal, $translate, $window, $filter, Workspace, Content, Helper, RuntimeResource, WorkspaceResource, WorkspaceBrowserService, User) {

            /**
             * The section selected by default
             * @type {string}
             */
            var defaultSection = 'information';
            var modalScope;

            /**
             *
             * @param {String} id   - the section id; if null or undefined sets default section
             */
            function setDashboardSection(id) {
                $scope.dashboardSection = id || defaultSection;
                if ($scope.dashboardSection === defaultSection) {
                    $location.search({});
                } else {
                    if ($scope.dashboardSection === 'content') {
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

            $scope.selectDashboardSection = function (id) {
                setDashboardSection(id);
            };

            $scope.$on('$routeUpdate', function () {
                if ($scope.dashboardSection === 'information' && !$location.search().section) {
                    return;
                }
                if ($scope.dashboardSection !== $location.search().section) {
                    setDashboardSection($location.search().section);
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

            (function init() {
                if (Workspace.active.workspace && Workspace.active.workspace.alias !== $route.current.params.alias) {
                    Workspace.clearActiveWorkspace();
                }
                $scope.User = User;
                $scope.Workspace = Workspace;
                $scope.dashboardModels = {
                    eventsLimit: 4,
                    requestsLimit: 3,
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
                    }, function (error) {
                        Helper.showErrorModal(error.data);
                        $location.url('/workspaces');
                    });
                });
            }());

        }]);
