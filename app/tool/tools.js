'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PluginsctrlCtrl
 * @description
 * # PluginsctrlCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ToolsCtrl', ['$scope', '$http', 'ToolsResource', function ($scope, $http, ToolsResource) {
        /**
         * Load List of available plugins
         */
        $scope.loadTools = function () {
            $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
            ToolsResource.getToolsList(
                function (tools) {
                    $scope.toolList = tools.entries;
                },
                function (error) {
                    console.log(error);
                }
            );
        };

        $scope.toolList = [];
        $scope.loadTools();
    }]);
