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

        $scope.models = {
            limit: 25
        };

        User.fetchFriendList();
        $scope.User = User;

        $scope.isMember = function (key) {
            return $scope.members && $filter('filter')($scope.members, {key: key}, true).length === 1;
        };

        $scope.search = function () {
            if ($scope.searchQuery && $scope.searchQuery.length > 2) {
                $scope.searchQueryLength = false;
                SearchResource.profiles({'_all*': $scope.searchQuery}, function (profiles) {
                    $scope.profiles = [];
                    angular.forEach(profiles, function (profile) {
                        if (profile.key !== User.key) {
                            ProfileResource.getCard({key: profile.key}, function (card) {
                                $scope.profiles.push(card);
                            });
                        }
                    });
                });
            } else {
                $scope.searchQueryLength = true;
            }
        };
    }]);
