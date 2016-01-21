'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMembersCtrl
 * @description
 * # WorkspaceDashboardMembersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMembersCtrl', ['$scope', '$modal', 'Workspace', 'GroupResource', function ($scope, $modal, Workspace, GroupResource) {

        var modalScope;

        function createModalScope() {
            modalScope = $scope.$new(true);
            modalScope.models = {};
            modalScope.$on('modal.hide', function () {
                modalScope.$destroy();
            });
        }

        $scope.addMember = function () {
            var addMemberModal;
            createModalScope();
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
    }]);
