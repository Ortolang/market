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

            User.sessionInitialized().then(function () {
                GroupResource.get({key: User.friends}, function (data) {
                    $scope.friends = data.members;

                    $scope.addFriend = function () {
                        var addMemberModal,
                            modalScope = $scope.$new(true);
                        modalScope.$on('modal.hide', function () {
                            modalScope.$destroy();
                        });
                        modalScope.members = $scope.friends;
                        modalScope.addFriend = true;
                        modalScope.add = function (profile) {
                            GroupResource.addMember({key: User.friends}, profile, function (data) {
                                $scope.friends = data.members;
                            });
                            addMemberModal.hide();
                        };
                        addMemberModal = $modal({
                            scope: modalScope,
                            template: 'workspace/templates/add-member-modal.html',
                            show: true
                        });
                    };
                });
            });
        }]);
