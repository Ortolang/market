'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PluginctrlCtrl
 * @description
 * # PluginctrlCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
      .controller('PluginCtrl', [ '$scope', '$http', 'PluginsResource', '$routeParams', function ($scope, $http, PluginsResource, $routeParams) {
        /**
         * Load chosen plugin
         */
        $scope.loadPlugin = function () {
            $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
            PluginsResource.getPlugin({pKey: $routeParams.plName},
                function (plugin) {
                    $scope.plugin = plugin;
                },
                function (error) {
                    console.log(error);
                });
        };

        $scope.plName = $routeParams.plName;
        $scope.plugin = null;
        $scope.loadPlugin();
    }]);
