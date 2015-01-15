'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TasksCtrl', ['$scope', 'Runtime', function ($scope, Runtime) {

        $scope.Runtime = Runtime;

    }]);
