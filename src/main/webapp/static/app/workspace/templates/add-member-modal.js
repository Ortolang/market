'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddMemberCtrl
 * @description
 * # AddMemberCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddMemberCtrl', ['$scope', '$filter', 'ProfileResource', 'GroupResource', 'User', 'SearchResource', function ($scope, $filter, ProfileResource, GroupResource, User, SearchResource) {

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
            SearchResource.findProfiles({content: $scope.searchQuery}, function (profiles) {
                $scope.profiles = [];
                angular.forEach(profiles, function (profile) {
                    if (profile.key !== User.key) {
                        ProfileResource.getCard({key: profile.key}, function (card) {
                            if ($scope.members && $filter('filter')($scope.members, {key: profile.key}, true).length === 1) {
                                card.alreadyMember = true;
                            }
                            $scope.profiles.push(card);
                        });
                    }
                });
            });
        };
    }]);
