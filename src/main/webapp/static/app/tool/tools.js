'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ToolsCtrl
 * @description
 * # ToolsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', '$http', 'ToolsResource', function ($scope, $http, ToolsResource) {
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
            ToolsResource.getToolsList(
                function (tools) {
                    $scope.toolServerList = tools.entries;
                    //angular.forEach (tools.entries, function(tool, key) {
                    //    // hack until all tools are externalized
                    //    if ( !angular.isUndefined(tool.url) && tool.url !== null ) {
                    //        var desc = $resource(tool.url + '/description');
                    //        desc.get(
                    //            function (tool) {
                    //                console.debug(tool);
                    //            },
                    //            function (error) {
                    //                console.log(error);
                    //            }
                    //        );
                    //    }
                    //});
                },
                function (error) {
                    console.log(error);
                }
            );
        }

        init();
    }]);
