'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TasksCtrl', ['$scope', 'Runtime', 'User', function ($scope, Runtime, User) {

        $scope.Runtime = Runtime;
        $scope.User = User;

    }]);
