'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FooterCtrl', [ '$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {
        $scope.goTop = function () {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash('top');

            // call $anchorScroll()
            $anchorScroll();
        };
    }]);
