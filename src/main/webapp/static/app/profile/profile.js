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
            //console.debug($scope.$parent.authenticated);
            //if($scope.$parent.authenticated) {
            //    var user = $scope.$parent.currentUser;
            //    console.debug($scope.$parent);
            //
            //    console.debug(user.name);
            //}

            $scope.section = $routeParams.section;
            $scope.isLocked = {
                firstName: true,
                lastName: true,
                username: true,
                organisation: true,
                email: true,
                status: true
            };
            $scope.user = {
                id: 1,
                firstName: 'Kurt',
                lastName: 'Cobain',
                username: 'KC',
                organisation: 'Nirvana',
                email: 'kurt.cobain@nirvana.org',
                status: 4
            };

            $scope.statuses = [
                {value: 1, text: 'status1'},
                {value: 2, text: 'status2'},
                {value: 3, text: 'status3'},
                {value: 4, text: 'status4'}
            ];
        }
]);

angular.module('ortolangMarketApp')
    .run(['editableOptions', function(editableOptions) {
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    }]);
