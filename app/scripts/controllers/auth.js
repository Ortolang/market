'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', 'Session', 'AuthService', '$rootScope', 'AuthEvents', 'CookieFactory', function ($scope, Session, AuthService, $rootScope, AuthEvents, CookieFactory) {
        console.debug('controller AuthCtrl');
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

        // Initialize session
        $scope.currentUser = null;
        CookieFactory.getCookie('currentUser').then(function (value) {
            if (value !== null && !angular.isUndefined(value)) {
                $scope.currentUser = Session.load(value);
            }
//            console.debug(value);
            $scope.authenticated = AuthService.isAuthenticated();
//        console.debug('User is Authenticated ?' + $scope.authenticated);
            $scope.wkList = [];
            if ($scope.authenticated) {
                $scope.loadWorkspaces($scope.currentUser.id);
            }
        });

        /**
         * Display broadcast messages in console
         * TODO handle this better
         */
        $scope.formMessage = '';
        /* alert-success, alert-warning, alert-info, alert-danger */
        $scope.formMessageClass = 'alert-info';

        $scope.$on('$auth:loginSuccess', function (event, data) {
            console.log('SUCCESS - LoginController:', event, data);
            $scope.formMessageClass = 'alert-success';
            $scope.formMessage = 'Login success.';
        });

        $scope.$on('$auth:loginFailure', function (event, data) {
            console.log('FAILURE - LoginController:', event, data);
            $scope.formMessageClass = 'alert-danger';
            $scope.formMessage = 'Username or password incorrect.';
        });

//        $rootScope.$on("status", function(event, message){
//            console.log("### STATUS : " + message);
//        });
    }]);
