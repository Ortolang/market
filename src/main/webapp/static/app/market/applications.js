'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', 'icons', 'QueryBuilderFactory', function ($scope) {

        function init() {
            $scope.type = 'Application';
        }
        init();

    }]);
