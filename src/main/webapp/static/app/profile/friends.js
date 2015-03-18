'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FriendsCtrl
 * @description
 * # FriendsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FriendsCtrl', ['$scope', 'ProfileResource',
        function ($scope, ProfileResource) {
            $scope.search = function(data) {
                ProfileResource.search({}, data, function(result){
                    $scope.search.result = result;
                });
            };

            ProfileResource.getFriends({userId: $scope.user.id}).$promise.then(function (friends) {
                $scope.friends = friends;
            });
        }
    ]);
