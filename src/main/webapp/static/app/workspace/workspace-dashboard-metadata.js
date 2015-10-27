'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceDashboardMetadataCtrl
 * @description
 * # WorkspaceDashboardMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceDashboardMetadataCtrl', ['$scope', '$http', 'url', 'ortolangType', 'Workspace',
        function ($scope, $http, url, ortolangType, Workspace) {


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

                var uploadUrl = url.api + '/workspaces/' + Workspace.active.workspace.key + '/elements/',
                    fd = new FormData(),
                    currentPath = '/';

                fd.append('path', currentPath);
                fd.append('type', ortolangType.metadata);

                // fd.append('format', $scope.userMetadataFormat.key);
                fd.append('name', 'ortolang-item-json');

                var blob = new Blob([content], { type: contentType});

                fd.append('stream', blob);

                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                .success(function () {
                    console.log('submit form success');
                    //TODO select preview tab of workspace-dashboard
                })
                .error(function (error) {
                    console.error('creation of metadata failed !', error);
                });
            }

        	function init() {
        		$scope.activeTab = 0; 

        		$scope.allCorporaStyles = [{id:'Scientifique', label:'Scientifique'}, {id:'Littéraire', label:'Littéraire'}];
        	}
        	init();
}]);