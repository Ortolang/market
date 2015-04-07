'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PersonalInfosCtrl
 * @description
 * # PersonalInfosCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PersonalInfosCtrl', ['$scope',
        function ($scope) {

            $scope.infosItems = $scope.populateFields('infos');

        }]);
