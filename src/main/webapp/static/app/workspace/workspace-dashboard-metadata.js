'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$scope', 'ortolangType', 'Workspace', 'WorkspaceElementResource',
        function ($scope, ortolangType, Workspace, WorkspaceElementResource) {


            $scope.submitForm = function () {
                console.log('submit form');

                if ($scope.ortolangItemJsonform.$invalid) {
                    console.log('not ready');
                    return;
                }

                delete Workspace.active.metadata.imageUrl;

                var content = angular.toJson(Workspace.active.metadata),
                    contentType = 'text/json';

                sendForm(content, contentType);
            };


            function sendForm(content, contentType) {

                var fd = new FormData(),
                    currentPath = '/';

                fd.append('path', currentPath);
                fd.append('type', ortolangType.metadata);

                // fd.append('format', $scope.userMetadataFormat.key);
                fd.append('name', 'ortolang-item-json');

                var blob = new Blob([content], { type: contentType});

                fd.append('stream', blob);

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function (data) {
                    console.log(data);
                    // TODO select preview tab of workspace-dashboard
                }, function (error) {
                    console.error('creation of metadata failed !', error);
                });
            }

            function init() {
                $scope.activeTab = 0;

                $scope.allCorporaStyles = [{id:'Scientifique', label:'Scientifique'}, {id:'Littéraire', label:'Littéraire'}];
            }
            init();
        }]);
