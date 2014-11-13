'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthEvents', 'AuthService', 'Storage',
        function ($scope, $rootScope, $location, AuthEvents, AuthService, Storage) {
            //console.log('LoginCtrl loaded');
            $scope.credentials = {
                username: '',
                password: '',
                remember: false
            };

            $scope.initializeFlashMessage();
            if (AuthService.isAuthenticated()) {
                $location.path('/');
            }

            /**
             * Process the login form : call by submit
             * @param credentials
             */
            $scope.processLogin = function (credentials) {
                AuthService.getUser(credentials)
                    .then(
                        /**
                         * success - initialize view for user
                         * @param user
                         */
                        function (user) {
                            //Todo use token
                            $scope.initializeSession(user);
                            if (credentials.remember) {
                                // arbitrary set to 7 days or 1 day : TODO declare this in a config file
                                Storage.setSession(user, 7);
                            } else {
                                Storage.setSession(user, 1);
                            }
                            $rootScope.$broadcast('$auth:loginSuccess', AuthEvents.loginSuccess);
                            //console.log(user);
                            // Redirect to previous page
                            AuthService.redirectToAttemptedUrl();
                        }
                    )
                    .catch(
                        /**
                         * error
                         * @param reason
                         */
                        function (reason) {
                            $scope.setAuthenticated(AuthService.isAuthenticated());
                            $rootScope.$broadcast('$auth:loginFailure', AuthEvents.loginFailed + reason.statusText);
                        }
                    );
            };
        }]);

