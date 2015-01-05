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
         * Load List of url of of available tools
         */
        function init() {
            ToolsResource.getToolsList(
                function (tools) {
                    $scope.toolList = tools.entries;
                    //angular.forEach (tools.entries, function(tool, key) {
                    //    // hack until all tools are externalize
                    //    if ( !angular.isUndefined(tool.url) && tool.url !== null ) {
                    //        ToolsResource.getToolDesc(
                    //            function (tool) {
                    //                console.debug(tool);
                    //            },
                    //            function (error) {
                    //                console.log(error);
                    //            });
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
