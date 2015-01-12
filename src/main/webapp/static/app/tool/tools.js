'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', '$http', 'PluginsResource', function ($scope, $http, PluginsResource) {
        /**
         * Load List of url of available tools
         */
        function init() {
            PluginsResource.getToolPluginsList(
                function (tools) {
                    $scope.toolList = tools.entries;
                },
                function (error) {
                    console.log(error);
                }
            );
            PluginsResource.getToolsList(
                function (tools) {
                    $scope.toolServerList = tools.entries;
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        init();
    }]);
