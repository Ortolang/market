'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TasksCtrl', ['$scope', 'Runtime', 'User', 'Helper', function ($scope, Runtime, User, Helper) {

        $scope.Runtime = Runtime;
        $scope.User = User;
        $scope.Helper = Helper;

        $scope.computePercentage = function (task) {
            var value = Math.floor((Date.now() - task.creationDate) / (task.dueDate - task.creationDate) * 100);
            return value > 0 ? value : 5;
        };

        $scope.progressColor = function (task) {
            var percentage = $scope.computePercentage(task);
            if (percentage < 33) {
                return 'success';
            }
            if (percentage < 66) {
                return 'warning';
            }
            return 'danger';
        };

    }]);
