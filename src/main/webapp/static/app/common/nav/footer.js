'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FooterCtrl', [ '$scope', '$window', '$anchorScroll', function ($scope, $window, $anchorScroll) {
        $scope.backToTop = function () {
            $anchorScroll('top');
        };

        $scope.contactUs = function () {
            $window.location = 'ma' + 'il' + 'to' + ':con' + 'tact' + '@' + 'ortolang.fr';
        };
    }]);
