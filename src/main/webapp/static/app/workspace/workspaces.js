'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspacesCtrl', ['$scope', '$rootScope', '$filter', '$location', 'AtmosphereService', 'WorkspaceResource', 'Settings', function ($scope, $rootScope, $filter, $location, AtmosphereService, WorkspaceResource, Settings) {

        function getWorkspaceList(refresh) {
            $scope.workspaceList = WorkspaceResource.get();
            if (!refresh) {
            }
        }

        $rootScope.$on('core.workspace.create', function (event, eventMessage) {
            $scope.workspaceList.$promise.then(function () {
                var workspace = $filter('filter')($scope.workspaceList.entries, {key: eventMessage.fromObject});
                if (!workspace || workspace.length !== 1) {
                    getWorkspaceList(true);
                }
            });
            event.stopPropagation();
        });

        function init() {
            getWorkspaceList(false);
        }
        init();
    }]);
