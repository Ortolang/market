'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', 'AuthEvents', 'AuthService', '$cookieStore',
        function ($scope, $rootScope, AuthEvents, AuthService, $cookieStore) {
            //console.log('LoginCtrl loaded');
            $scope.credentials = {
                username: '',
                password: ''
            };
            /**
             * Process the login form : call by submit
             * @param credentials
             */
            $scope.processLogin = function (credentials) {
                AuthService.getSession(credentials)
                    .then(
                        /**
                         * success - initialize view for user
                         * @param user
                         */
                        function (user) {
                            //Todo use token
                            $scope.setCurrentUser(user);
                            $scope.setAuthenticated(AuthService.isAuthenticated());
                            $scope.loadWorkspaces(user.id);
                            $cookieStore.put('currentUser', user);
                            $rootScope.$broadcast('$auth:loginSuccess', AuthEvents.loginSuccess);
                            //console.log(user);
                        },
                        /**
                         * error
                         * @param reason
                         */
                        function (reason) {
                            //console.log(reason);
                            $scope.setAuthenticated(AuthService.isAuthenticated());
                            $rootScope.$broadcast('$auth:loginFailure', AuthEvents.loginFailed + reason.statusText);
                        }
                    );
            };
        }]);

