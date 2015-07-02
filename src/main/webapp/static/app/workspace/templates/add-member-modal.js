'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AddMemberCtrl
 * @description
 * # AddMemberCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AddMemberCtrl', ['$scope', 'ProfileResource', 'ObjectResource', function ($scope, ProfileResource, ObjectResource) {

        $scope.change = function () {
            ObjectResource.index({query: 'SERVICE:"membership" AND CONTENT:' + $scope.searchQuery + '*'}, function (data) {
                $scope.profiles = [];
                angular.forEach(data, function (result) {
                    ProfileResource.getCard(result, function (card) {
                        $scope.profiles.push(card);
                    });
                });
            });
        };
    }]);
