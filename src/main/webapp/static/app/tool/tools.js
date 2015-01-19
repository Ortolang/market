'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'ToolManager', function ($scope, ToolManager) {

        $scope.toolServerList = ToolManager.getRegistry();
    }]);
