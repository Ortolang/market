'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
      .controller('WorkspacesCtrl', ['$rootScope', '$scope', '$http', 'WorkspaceResource', 'ProcessResource', 'ObjectResource', 'AuthService', 'AuthEvents', function ($rootScope, $scope, $http, WorkspaceResource, ProcessResource, ObjectResource, AuthService, AuthEvents) {

        $scope.createWorkspace = function () {
            if ($scope.newWorkspaceName !== undefined) {
                $('#new-workspace-name').parentsUntil('form', '.form-group').removeClass('has-error');
                //TODO generate a key compatible based on the name
                var key = $scope.newWorkspaceName, data = {key: key, name: $scope.newWorkspaceName, type: $scope.newWorkspaceType};
                WorkspaceResource.save(data, function () {

                    // Refresh list of workspaces
                    $scope.authenticated = AuthService.isAuthenticated();
                    $scope.wkList = [];
                    if ($scope.authenticated) {
                        $scope.loadWorkspaces($scope.currentUser.id);

                        // Refresh workspace view
                        //Todo use token
                        AuthService.getWorkspaces($scope.currentUser.id)
                            .then(
                                function (wks) {
                                    //$scope.setWkList(wks);
                                    $scope.wkList = wks;
                                },
                                function (reason) {
                                    console.log(reason);
                                    $rootScope.$broadcast('$auth:loginFailure', AuthEvents.loginFailed + ' - error while loading workspaces');
                                }
                            );

                    }

                    $('#createWorkspaceModal').modal('hide');
                    $scope.newWorkspaceName = undefined;
                    $scope.newWorkspaceType = undefined;

                }, function(error) {
                    // deferred.reject(error);
                    console.error(error);
                });

            } else {
                $('#new-workspace-name').parentsUntil('form', '.form-group').addClass('has-error');
            }
        };


        $scope.publishWorkspace = function (wk) {
            console.debug('publish workspace ' + wk.name);
            console.debug('push head ' + wk.head);

            // List keys
            ObjectResource.keys({oKey: wk.head}, function (listKeys) {
                console.debug(listKeys);

                var data = {name: 'Publication process for ' + wk.name, type: 'simple-publication'}, params = $.param(data);
                angular.forEach(listKeys.entries, function (entry) {
                    params += '&keys=' + entry;
                });

                console.debug(params);

                ProcessResource.create(params, function () {
                    console.debug('Publication process created');
                }, function (error) {
                    // deferred.reject(error);
                    console.debug('Publication process failed');
                    console.error(error);
                });

            });
            /*
            var data = {name: 'Publication process for '+wk.name, type: 'simple-publication'};
            var params = $.param(data) + '&keys='+wk.head;
            console.debug(params);

             ProcessResource.create(params, function() {
                console.debug('Publication success');
            }, function(error) {
                // deferred.reject(error);
                console.debug('Publication failed');
                console.error(error);
            });
*/
        };

        $scope.importWorkspace = function () {
            console.debug('import workspace ');

            /*
            if ($scope.importWorkspaceName !== undefined) {
                $('#import-workspace-name').parentsUntil('form', '.form-group').removeClass('has-error');
                //TODO generate a key compatible based on the name
                var key = $scope.importWorkspaceName;

                var data = {name: 'Import BagIt process for '+wk.name, type: 'import-workspace', workspace-key: key, workspace-name: $scope.importWorkspaceName, workspace-type: $scope.importWorkspaceType};
                var params = $.param(data);
                console.debug(params);

                ProcessResource.create(params, function() {
                    console.debug('Import success');
                }, function(error) {
                    // deferred.reject(error);
                    console.debug('Import failed');
                    console.error(error);
                });
            } else {
                $('#import-workspace-name').parentsUntil('form', '.form-group').addClass('has-error');
            }
            */
        };
    }]);
