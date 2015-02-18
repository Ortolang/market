'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:InformationCtrl
 * @description
 * # InformationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('InformationCtrl', ['$scope', '$routeParams', '$location', '$anchorScroll', function ($scope, $routeParams, $location, $anchorScroll) {

        $scope.goTo = function (target) {
            $location.hash(target);
            $anchorScroll();
        };

        $scope.section = $routeParams.section;

    }]);
