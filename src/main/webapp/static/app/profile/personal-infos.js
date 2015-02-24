'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PersonalInfosCtrl
 * @description
 * # PersonalInfosCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PersonalInfosCtrl', ['$scope', '$routeParams', 'ProfileResource', '$filter',
        function ($scope, $routeParams, ProfileResource, $filter) {


            $scope.addNewUrlPro = function() {
                var lastItem, newItemNo = 0;
                if($scope.urlPros.length>0) {
                    lastItem = $scope.urlPros[$scope.urlPros.length - 1];
                    newItemNo = lastItem.index + 1;
                }
                $scope.urlPros.push({index:newItemNo, url:''});
            };

            $scope.removeUrlPro = function(item) {
                var index = $scope.urlPros.indexOf(item);
                var index2 = $scope.user.urlPros.indexOf(item);
                if (index !== -1) {
                    $scope.urlPros.splice(index, 1);
                    $scope.user.urlPros.splice(index2, 1);
                }
            };

            $scope.showCivility = function() {
                var selected = $filter('filter')($scope.civilities, {value: $scope.user.civility});
                return ($scope.user.civility && selected.length) ? selected[0].text : 'empty';
            };

            $scope.updateUser = function(data) {
                $scope.user.urlPros.push(data);
            };

        }
    ]);
