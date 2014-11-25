'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TopNavCtrl
 * @description
 * # TopNavCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TopNavCtrl', [ '$scope', '$location', '$translate', 'AuthService', 'Storage', 'User', function ($scope, $location, $translate, AuthService, Storage, User) {

        $scope.logout = function () {
            Storage.destroySession();
            User.destroy();
            $scope.setCurrentUser(null);
            $scope.setAuthenticated(AuthService.isAuthenticated());
            $location.path('/');
        };

        $scope.currentLanguage = $translate.preferredLanguage();

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey).then(function (langKey) {
                $scope.currentLanguage = langKey;
            });
        };
    }]);
