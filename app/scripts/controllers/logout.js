'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LogoutCtrl', ['$scope', 'Session', 'AuthService', '$cookieStore',
        function ($scope, Session, AuthService, $cookieStore) {
            //TODO stuff befor logout like saving work
            $cookieStore.remove('currentUser');
            Session.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $scope.setWkList([]);
        }
    ]);
