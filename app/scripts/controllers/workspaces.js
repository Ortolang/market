'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspacesCtrl
 * @description
 * # WorkspacesCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
      .controller('WorkspacesCtrl', ['$rootScope', '$scope','$http', 'WorkspacesDAO', 'Process', 'AuthService', 'AuthEvents', function ($rootScope, $scope, $http, WorkspacesDAO, Process, AuthService, AuthEvents) {

        $scope.createWorkspace = function () {
            if ($scope.newWorkspaceName !== undefined) {
                $('#new-workspace-name').parentsUntil('form', '.form-group').removeClass('has-error');
                //TODO generate a key compatible based on the name
                var key = $scope.newWorkspaceName;
                var data = {key:key, name: $scope.newWorkspaceName, type: $scope.newWorkspaceType};
                WorkspacesDAO.save(data, function() {
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
            console.debug('publish workspace '+wk.name);
        };
    }]);
