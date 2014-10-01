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
                AuthService.getSession(credentials)
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
                                CookieFactory.setCookie('currentUser', user, 7);
                            } else {
                                CookieFactory.setCookie('currentUser', user, 1);
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

