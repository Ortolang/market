'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LogoutCtrl', ['$scope', 'Session', 'AuthService', 'CookieFactory',
        function ($scope, Session, AuthService, CookieFactory) {
            //TODO stuff before logout like saving work
            CookieFactory.deleteCookie('currentUser');
            Session.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $scope.setWkList([]);
        }
    ]);
