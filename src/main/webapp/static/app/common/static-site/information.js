'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:InformationCtrl
 * @description
 * # InformationCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('InformationCtrl', ['$scope', '$routeParams', '$location', '$anchorScroll', 'StaticWebsite', 'url',
        function ($scope, $routeParams, $location, $anchorScroll, StaticWebsite, url) {

        $scope.StaticWebsite = StaticWebsite;

        $scope.goToAnchor = function (newHash) {
            console.debug(newHash);
            if ($location.hash() !== newHash) {
                $location.hash(newHash);
            } else {
                $anchorScroll();
            }
        };

        $scope.section = $routeParams.section;

    }]);
