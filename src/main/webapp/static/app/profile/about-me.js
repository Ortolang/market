'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AboutMeCtrl
 * @description
 * # AboutMeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AboutMeCtrl', ['$scope', function ($scope) {

        $scope.aboutmeItems = $scope.populateFields('aboutme');

    }]);
