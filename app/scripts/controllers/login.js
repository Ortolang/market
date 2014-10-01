'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthEvents', 'AuthService', 'CookieFactory',
        function ($scope, $rootScope, $location, AuthEvents, AuthService, CookieFactory) {
            //console.log('LoginCtrl loaded');
            $scope.credentials = {
                username: '',
                password: ''
            };

            if (AuthService.isAuthenticated()) {
                $location.path('/');
            }

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
                            CookieFactory.setCookie('currentUser', user, 1);
                            $rootScope.$broadcast('$auth:loginSuccess', AuthEvents.loginSuccess);
                            //console.log(user);
                            // Redirect to previous page
                            AuthService.redirectToAttemptedUrl();
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

