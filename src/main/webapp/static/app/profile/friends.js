'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FriendsCtrl
 * @description
 * # FriendsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FriendsCtrl', ['$scope', 'User', 'ProfileResource',
        function ($scope, User, ProfileResource) {

            $scope.search = function (data) {
                ProfileResource.search({}, data, function (result) {
                    $scope.search.result = result;
                });
            };

            ProfileResource.getFriends({key: User.key}).$promise.then(function (friends) {
                $scope.friends = friends;
            });
        }]);
