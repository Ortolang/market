'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LogoutCtrl', ['$scope', '$location', 'Session', 'AuthService', 'User',
        function ($scope, $location, Session, AuthService, User) {
            //TODO stuff before logout like saving work
            Session.destroySession();
            User.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $scope.setWkList([]);
            $location.path('/');
        }
    ]);
