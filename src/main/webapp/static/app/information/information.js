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

        $scope.goToAnchor = function (newHash) {
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and $anchorScroll will automatically scroll to it
                $location.hash(newHash);
            } else {
                // call $anchorScroll() explicitly, since $location.hash hasn't changed
                $anchorScroll();
            }
        };

        $scope.showPolicyContents = false;

        $scope.section = $routeParams.section;

    }]);
