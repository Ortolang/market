'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FriendsCtrl
 * @description
 * # FriendsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FriendsCtrl', ['$scope', '$modal', 'User', 'GroupResource',
        function ($scope, $modal, User, GroupResource) {

            $scope.User = User;

            User.sessionInitialized().then(function () {
                User.fetchFriendList();

                $scope.addFriend = function () {
                    var addMemberModal,
                        modalScope = $scope.$new(true);
                    modalScope.$on('modal.hide', function () {
                        modalScope.$destroy();
                    });
                    modalScope.members = $scope.friends;
                    modalScope.addFriend = true;
                    modalScope.add = function (profile) {
                        GroupResource.addMember({key: User.friends, member: profile.key}, {}, function (data) {
                            User.friendList = data.members;
                        });
                        addMemberModal.hide();
                    };
                    addMemberModal = $modal({
                        scope: modalScope,
                        templateUrl: 'workspace/templates/add-member-modal.html',
                        show: true
                    });
                };

                $scope.removeFriend = function (member) {
                    GroupResource.removeMember({key: User.friends, member: member}, function (data) {
                        User.friendList = data.members;
                    });
                };
            });
        }]);
