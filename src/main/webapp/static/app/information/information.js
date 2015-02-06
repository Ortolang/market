'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:InformationCtrl
 * @description
 * # InformationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('InformationCtrl', ['$scope', '$routeParams',
        function ($scope, $routeParams) {
            $scope.section = $routeParams.section;
        }
    ]);
