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
        'Workspace',
        'Content',
        'Runtime',
        'WorkspaceResource',
        'WorkspaceBrowserService',
        function ($scope, $rootScope, $location, $route, $modal, $translate, $window, Workspace, Content, Runtime, WorkspaceResource, WorkspaceBrowserService) {

            /**
             * The section selected by default
             * @type {string}
             */
            var defaultSection = 'information';
            var modalScope;

            $scope.selectDashboardSection = function (id) {
                if ($location.search().section === 'content' && id !== 'content') {
                    setDashboardSection(id, true);
                } else {
                    setDashboardSection(id, false);
                }
            };

            /**
             *
             * @param {String} id                   - the section id; if null or undefined sets default section
             * @param {boolean} [clearSearchParts]  - true to clear search parts
             */
            function setDashboardSection(id, clearSearchParts) {
                if (id === 'content') {
                    WorkspaceBrowserService.workspace = Workspace.active.workspace;
                }
                if (clearSearchParts) {
                    $location.url($location.path());
                }
                $scope.dashboardSection = id || defaultSection;
                $location.search('section', id);
            }

            function createModalScope() {
                modalScope = $scope.$new(true);
                modalScope.models = {};
                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });
            }

            // *********************** //
            //       Publication       //
            // *********************** //

            $scope.publishWorkspace = function () {
                if (Workspace.active.metadata) {
                    var publishModal;
                    createModalScope();
                    modalScope.wsName = Workspace.active.workspace.name;
                    modalScope.publish = function () {
                        Runtime.createProcess({
                            'process-type': 'publish-workspace',
                            'process-name': 'Publication of workspace: ' + Workspace.active.workspace.name,
                            'wskey': Workspace.active.workspace.key
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
            };

            // *********************** //
            //        Deletion         //
            // *********************** //

            $scope.deleteWorkspace = function () {
                var deleteWorkspaceModal;
                createModalScope();
                modalScope.wsName = Workspace.active.workspace.name;
                modalScope.delete = function () {
                    WorkspaceResource.delete({wskey: Workspace.active.workspace.key}).$promise.then(function (data) {
                        $rootScope.$emit('process-created', data);
                    });
                    deleteWorkspaceModal.hide();
                    $location.url('/workspaces');
                };
                deleteWorkspaceModal = $modal({
                    scope: modalScope,
                    template: 'workspace/templates/delete-workspace-modal.html',
                    show: true
                });
            };

            $scope.$on('$routeUpdate', function () {
                if ($scope.dashboardSection !== $location.search().section) {
                    var clearSearch = $scope.dashboardSection === 'content' && $location.search().section !== 'content';
                    setDashboardSection($location.search().section, clearSearch);
                }
            });

            $scope.$on('$destroy', function () {
                $rootScope.ortolangPageSubtitle = undefined;
            });

            function displaySearchErrorModal(cause, params) {
                console.log('displaySearchErrorModal', cause, params);
                $modal({
                    title: $translate.instant('WORKSPACE.SEARCH_ERROR_MODAL.TITLE'),
                    content: $translate.instant('WORKSPACE.SEARCH_ERROR_MODAL.BODY_' + cause, params),
                    show: true
                });
            }

            (function init() {
                if (Workspace.active.workspace && Workspace.active.workspace.alias !== $route.current.params.alias) {
                    Workspace.clearActiveWorkspace();
                }
                $scope.Workspace = Workspace;
                $scope.dashboardModels = {
                    eventsLimit: 5
                };
                Workspace.getWorkspaceList(true).then(function () {
                    Workspace.setActiveWorkspaceFromAlias($route.current.params.alias).then(function () {
                        $rootScope.ortolangPageSubtitle = ' - ' + Workspace.active.workspace.alias;
                        setDashboardSection($location.search().section);
                        $scope.dashboardModels.links = {
                            base: $window.location.origin,
                            market: '#/market/item/' + Workspace.active.workspace.alias,
                            content: Content.getContentUrlWithPath('', Workspace.active.workspace.alias)
                        };
                    }, function () {
                        displaySearchErrorModal('ALIAS', {alias: $route.current.params.alias});
                        $location.url('/workspaces');
                    });
                });
            }());

        }]);
