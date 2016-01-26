'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMembersCtrl
 * @description
 * # WorkspaceDashboardMembersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMembersCtrl', ['$scope', '$modal', 'Workspace', 'GroupResource', 'User', 'Helper', function ($scope, $modal, Workspace, GroupResource, User, Helper) {

        $scope.User = User;

        $scope.addMember = function () {
            var addMemberModal,
                modalScope = Helper.createModalScope(true);
            modalScope.wsName = Workspace.active.workspace.name;
            modalScope.members = Workspace.active.members;
            modalScope.add = function (profile) {
                GroupResource.addMember({key: Workspace.active.workspace.members, member: profile.key}, {}, function (data) {
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

        $scope.removeMember = function (member) {
            if (User.key === Workspace.active.workspace.owner) {
                GroupResource.removeMember({key: Workspace.active.workspace.members, member: member}, function (data) {
                    Workspace.active.members = data.members;
                });
            }
        };
    }]);
