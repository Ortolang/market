'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$rootScope', '$filter', '$location', '$modal', '$translate', 'AtmosphereService', 'WorkspaceResource', 'ObjectResource', 'WorkspaceBrowserService', 'Settings', function ($scope, $rootScope, $filter, $location, $modal, $translate, AtmosphereService, WorkspaceResource, ObjectResource, WorkspaceBrowserService, Settings) {

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
                    } else {
                        $scope.resizeBrowser();
                    }
                });
            }
        }

        function getWorkspaceMembers(groupKey) {
            ObjectResource.get({oKey: groupKey}, function (data) {
                $scope.workspaceMembers = data.object;
            });
        }

        //$scope.showMembers = function () {
        //    createModalScope();
        //    modalScope.wsName = $scope.browserService.workspace.name;
        //    modalScope.members = $scope.workspaceMembers.members;
        //
        //    $modal({
        //        scope: modalScope,
        //        template: 'workspace/templates/workspace-members-modal.html',
        //        show: true
        //    });
        //};

        $rootScope.$on('core.workspace.create', function (event, eventMessage) {
            $scope.workspaceList.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {key: eventMessage.fromObject});
                if (!workspace || workspace.length !== 1) {
                    getWorkspaceList(true);
                }
            });
            event.stopPropagation();
        });

        function init() {
            getWorkspaceList(false);
        }
        init();
    }]);
