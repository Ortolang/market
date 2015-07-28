'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddMemberCtrl
 * @description
 * # AddMemberCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddMemberCtrl', ['$scope', '$filter', 'ProfileResource', 'ObjectResource', 'GroupResource', 'icons', 'User', function ($scope, $filter, ProfileResource, ObjectResource, GroupResource, icons, User) {

        $scope.icons = icons;

        if (!$scope.addFriend) {
            User.sessionInitialized().then(function () {
                GroupResource.get({key: User.friends}, function (data) {
                    $scope.friends = [];
                    angular.forEach(data.members, function (friend) {
                        if ($scope.members && $filter('filter')($scope.members, {key: friend.key}, true).length === 1) {
                            friend.alreadyMember = true;
                        }
                        $scope.friends.push(friend);
                    });
                });
            });
        }

        $scope.search = function () {
            ObjectResource.index({query: 'SERVICE:"membership" AND CONTENT:' + $scope.searchQuery + '*'}, function (data) {
                $scope.profiles = [];
                angular.forEach(data, function (result) {
                    if (result.key !== User.key) {
                        ProfileResource.getCard(result, function (card) {
                            if ($scope.members && $filter('filter')($scope.members, {key: result.key}, true).length === 1) {
                                card.alreadyMember = true;
                            }
                            $scope.profiles.push(card);
                        });
                    }
                });
            });
        };
    }]);
