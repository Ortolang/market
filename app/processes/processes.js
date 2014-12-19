'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProcessesCtrl
 * @description
 * # ProcessesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProcessesCtrl', ['$rootScope', '$scope', '$modal', '$filter', '$timeout', '$translate', 'Runtime', 'ToolsResource', function ($rootScope, $scope, $modal, $filter, $timeout, $translate, Runtime, ToolsResource) {

        $scope.Runtime = Runtime;

        $scope.completedProcessessDisplayed = 3;

        $scope.showLog = function (process) {
            Runtime.selectProcess(process);
            $modal({
                title: process.name,
                html: true,
                scope: $scope,
                template: '/processes/process-log-modal-template.html',
                show: true
            });
        };

        $scope.showResult = function (toolJob) {
            Runtime.selectProcess(toolJob);
            ToolsResource.getToolResult({pKey: toolJob.name.toLowerCase(), jId: toolJob.id}).$promise.then(function (data) {
                $scope.results = data;
                console.debug(data);
                $modal({
                    title: toolJob.name,
                    html: true,
                    scope: $scope,
                    template: '/tool/tool-result-modal-template.html',
                    show: true
                });
            });

        };

        $scope.activeTab = 0;

        $scope.showAll = function ($event) {
            $($event.target).addClass('hidden').prev('table').addClass('show-all');
        };
    }]);
