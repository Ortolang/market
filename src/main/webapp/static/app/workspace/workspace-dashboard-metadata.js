'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$scope', '$location', 'ortolangType', 'ObjectResource', 'Workspace', 'WorkspaceElementResource',
        function ($scope, $location, ortolangType, ObjectResource, Workspace, WorkspaceElementResource) {

            $scope.submitForm = function () {
                console.log('submit form');

                if ($scope.ortolangItemJsonform.$invalid) {
                    console.log('not ready');
                    return;
                }

                delete $scope.metadata.imageUrl;

                var content = angular.toJson($scope.metadata),
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

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function () {
                	Workspace.refreshActiveWorkspaceMetadata().then(function() {
                        Workspace.getActiveWorkspaceMetadata().then(function() {
                            $location.search('section', 'preview');    
                        });
                    });
                });
            }

            function init() {
                $scope.activeTab = 0;
                if(Workspace.active.metadata!==null) {
                    $scope.metadata = angular.copy(Workspace.active.metadata);
                } else {
                    $scope.metadata = {schema: 'http://www.ortolang.fr/schema/013#'};
                }

                ObjectResource.size({key: Workspace.active.workspace.head}, function (data) {
                    $scope.metadata.datasize = data.size.toString();
                });

            }
            init();
        }]);
