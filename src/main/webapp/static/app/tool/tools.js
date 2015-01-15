'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', 'ToolsResource', 'ToolManager', function ($scope, ToolsResource, ToolManager) {

        $scope.toolServerList = ToolManager.getRegistry();

        /**
         * Load List of url of available tools
         */
        function init() {
            ToolsResource.getToolPluginsList(
                function (tools) {
                    $scope.toolList = tools.entries;
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        init();
    }]);
