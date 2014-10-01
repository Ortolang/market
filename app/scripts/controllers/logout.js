'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LogoutCtrl', ['$scope', '$location', 'Session', 'AuthService', 'CookieFactory',
        function ($scope, $location, Session, AuthService, CookieFactory) {
            //TODO stuff before logout like saving work
            CookieFactory.deleteCookie('currentUser');
            Session.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $scope.setWkList([]);
            $location.path('/');
        }
    ]);
