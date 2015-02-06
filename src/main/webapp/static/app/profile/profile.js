'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProfileCtrl', ['$scope', '$routeParams',
        function ($scope, $routeParams) {
            console.debug($scope.$parent.authenticated);
            //if($scope.$parent.authenticated) {
            //    var user = $scope.$parent.currentUser;
            //    console.debug($scope.$parent);
            //
            //    console.debug(user.name);
            //}

            $scope.section = $routeParams.section;
            $scope.isVisible = true;
            $scope.user = {
                name: 'awesome user'
            };
        }
]);
