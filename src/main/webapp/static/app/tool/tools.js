'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
<<<<<<< HEAD
    .controller('ToolsCtrl', ['$scope', '$http', 'PluginsResource', function ($scope, $http, PluginsResource) {
=======
    .controller('ToolsCtrl', ['$scope', 'ToolsResource', function ($scope, ToolsResource) {
>>>>>>> b62b9b39e016fd71d1e876d107eab37a68e7c06a
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
