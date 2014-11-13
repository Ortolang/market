'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$location', 'AuthService', 'Storage', 'User', function ($scope, $location, AuthService, Storage, User) {

        $scope.logout = function () {
            Storage.destroySession();
            User.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            //$scope.setWkList([]);
            $location.path('/');
        };
    }]);
