'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AuthCtrl', ['$scope', '$q', 'User', '$rootScope', 'AuthService', 'ProfileResource', 'Storage', function ($scope, $q, User, $rootScope, AuthService, ProfileResource, Storage) {

        function getUser() {
            ProfileResource.connected().$promise.then(function (profile) {
                $scope.currentUser = User.create(profile);
            });
        }

        /**
         * Initialize scope var from the session
         */
        $scope.initializeSession = function (user) {
            $scope.authenticated = AuthService.isAuthenticated();
            if (AuthService.isAuthenticated()) {
                getUser();
            }
            //if (angular.isDefined(user)) {
            //    $scope.currentUser = user;
            //    $scope.authenticated = AuthService.isAuthenticated();
            //    //AuthService.setUserId(user.id);
            //} else {
            //    $scope.currentUser = null;
            //    Storage.getSession().then(function (value) {
            //        if (value !== null && !angular.isUndefined(value)) {
            //            $scope.currentUser = User.load(value);
            //        }
            //        //            console.debug(value);
            //        $scope.authenticated = AuthService.isAuthenticated();
            //        // console.debug('User is Authenticated ?' + $scope.authenticated);
            //        if ($scope.authenticated) {
            //            //AuthService.setUserId($scope.currentUser.id);
            //        }
            //    });
            //}
        };

        // Initialize session
        $scope.initializeSession();
    }]);
