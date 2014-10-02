'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', 'User', 'AuthService', '$rootScope', 'AuthEvents', 'Session', function ($scope, User, AuthService, $rootScope, AuthEvents, Session) {
        //console.debug('controller AuthCtrl');
        /**
         * Set currentUser
         * @param user
         */
        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;
        };

        /**
         * Set authenticated
         * @param isAuthenticated
         */
        $scope.setAuthenticated = function (isAuthenticated) {
            $scope.authenticated = isAuthenticated;
        };

        /**
         * Set wkList
         * @param workspaces
         */
        $scope.setWkList = function (workspaces) {
            $scope.wkList = workspaces;
        };

        /**
         * Load workspaces of current user
         * @param userId
         */
        $scope.loadWorkspaces = function (userId) {
            //Todo use token
            AuthService.getWorkspaces(userId)
                .then(
                    /**
                     * success
                     * @param wks
                     */
                    function (wks) {
                        $scope.setWkList(wks);
                        //console.log(user);
                    },
                    /**
                     * error
                     * @param reason
                     */
                    function (reason) {
                        console.log(reason);
                        $rootScope.$broadcast('$auth:loginFailure', AuthEvents.loginFailed + ' - error while loading workspaces');
                    }
                );
        };

        /**
         * Initialize scope var from the session
         */
        $scope.initializeSession = function (user) {
            if (angular.isDefined(user)) {
                $scope.currentUser = user;
                $scope.setAuthenticated(AuthService.isAuthenticated());
                $scope.loadWorkspaces(user.id);
            } else {
                $scope.currentUser = null;
                Session.getSession().then(function (value) {
                    if (value !== null && !angular.isUndefined(value)) {
                        $scope.currentUser = User.load(value);
                    }
                    //            console.debug(value);
                    $scope.authenticated = AuthService.isAuthenticated();
                    //        console.debug('User is Authenticated ?' + $scope.authenticated);
                    $scope.wkList = [];
                    if ($scope.authenticated) {
                        $scope.loadWorkspaces($scope.currentUser.id);
                    }
                });
            }
        };

        /**
         * Initialize the var for flash messages
         */
        $scope.initializeFlashMessage = function (formMessage, formMessageClass) {
            if (!angular.isDefined(formMessage)) {
                $scope.formMessage = '';
                /* alert-success, alert-warning, alert-info, alert-danger */
                $scope.formMessageClass = 'alert-info';
            } else {
                $scope.formMessageClass = formMessageClass;
                $scope.formMessage = formMessage;
            }
        };


        /**
         * Display broadcast messages in console and in flash div
         * TODO handle this better
         */
        $scope.$on('$auth:loginSuccess', function (event, data) {
            console.log('SUCCESS - LoginController:', event, data);
            $scope.initializeFlashMessage('Login success.', 'alert-success');
        });

        $scope.$on('$auth:loginFailure', function (event, data) {
            console.log('FAILURE - LoginController:', event, data);
            $scope.initializeFlashMessage('Username or password incorrect.', 'alert-danger');
        });

        $scope.$on('$auth:notAuthenticated', function (event, data) {
            console.log('FAILURE - RouteProvider:', event, data);
            $scope.initializeFlashMessage('Please log in first.', 'alert-danger');
        });

        $scope.$on('$auth:notAuthorized', function (event, data) {
            console.log('WARNING - RouteProvider:', event, data);
            $scope.initializeFlashMessage('You are not authorized here.', 'alert-warning');
        });

//        $rootScope.$on("status", function(event, message){
//            console.log("### STATUS : " + message);
//        });

        // Initialize session
        $scope.initializeSession();
        // Initialize flash messages
        $scope.initializeFlashMessage();
    }]);
