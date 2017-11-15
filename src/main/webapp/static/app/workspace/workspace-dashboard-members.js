'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMembersCtrl
 * @description
 * # WorkspaceDashboardMembersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMembersCtrl', ['$scope', '$modal', 'Workspace', 'GroupResource', 'WorkspaceResource', 'User', 'Helper', function ($scope, $modal, Workspace, GroupResource, WorkspaceResource, User, Helper) {

        $scope.User = User;

        $scope.addMember = function () {
            var addMemberModal,
                modalScope = Helper.createModalScope(true);
            modalScope.wsName = Workspace.getActiveWorkspaceTitle();
            modalScope.members = Workspace.active.members;
            modalScope.add = function (profile, $event) {
                $event.stopPropagation();
                WorkspaceResource.addMember({wskey: Workspace.active.workspace.key, member: profile.key}, {}, function (data) {
                    Workspace.active.members = data.members;
                });
                addMemberModal.hide();
            };
            addMemberModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/add-member-modal.html',
                show: true
            });
        };

        $scope.removeMember = function (member, $event) {
            $event.stopPropagation();
            if (User.key === Workspace.active.workspace.owner || User.isRoot()) {
                GroupResource.removeMember({key: Workspace.active.workspace.members, member: member}, function (data) {
                    Workspace.active.members = data.members;
                });
            }
        };

        $scope.changeOwner = function () {
            if (User.key === Workspace.active.workspace.owner || User.isRoot()) {
                var changeOwnerModal,
                    modalScope = Helper.createModalScope(true);
                modalScope.wsName = Workspace.getActiveWorkspaceTitle();
                modalScope.members = Workspace.active.members;
                modalScope.owner = Workspace.active.workspace.owner;
                modalScope.change = function (member, $event) {
                    $event.stopPropagation();
                    WorkspaceResource.changeOwner({wskey: Workspace.active.workspace.key}, {newowner: member}, function () {
                        Workspace.refreshActiveWorkspaceInfo();
                    });
                    changeOwnerModal.hide();
                };
                changeOwnerModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/change-owner-modal.html',
                    show: true
                });
            }
        };

        $scope.addPrivilegedMember = function () {
            var addMemberModal,
                modalScope = Helper.createModalScope(true);
            modalScope.wsName = Workspace.getActiveWorkspaceTitle();
            modalScope.privileged = Workspace.active.privileged;
            modalScope.add = function (profile, $event) {
                $event.stopPropagation();
                WorkspaceResource.addPrivilegedMember({wskey: Workspace.active.workspace.key, member: profile.key}, {}, function (data) {
                    Workspace.active.privileged = data.members;
                }, function (reason) {
                    console.log(reason);
                });
                addMemberModal.hide();
            };
            addMemberModal = $modal({
                scope: modalScope,
                templateUrl: 'workspace/templates/add-member-modal.html',
                show: true
            });
        };

        $scope.removePrivilegedMember = function (member, $event) {
            $event.stopPropagation();
            if (User.key === Workspace.active.workspace.owner || User.isRoot()) {
                GroupResource.removeMember({key: Workspace.active.workspace.privileged, member: member}, function (data) {
                    Workspace.active.privileged = data.members;
                });
            }
        };

    }]);
