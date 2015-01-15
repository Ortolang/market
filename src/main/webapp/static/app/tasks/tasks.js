'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TasksCtrl
 * @description
 * # TasksCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TasksCtrl', ['$rootScope', '$scope', '$modal', '$filter', '$timeout', '$translate', 'Runtime', 'ToolsResource', function ($rootScope, $scope, $modal, $filter, $timeout, $translate, Runtime, ToolsResource) {

        $scope.Runtime = Runtime;

    }]);
