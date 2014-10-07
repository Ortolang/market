'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PluginsctrlCtrl
 * @description
 * # PluginsctrlCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PluginsCtrl', ['$scope', '$http', 'PluginsResource', function ($scope, $http, PluginsResource) {
        /**
         * Load List of available plugins
         */
        $scope.loadPlugins = function () {
            $http.defaults.headers.common.Authorization = 'Basic ' + $scope.currentUser.id;
            PluginsResource.getPluginsList(
                function (plugins) {
                    $scope.plgList = plugins.entries;
                },
                function (error) {
                    console.log(error);
                }
            );
        };

        $scope.plgList = [];
        $scope.loadPlugins();
    }]);
