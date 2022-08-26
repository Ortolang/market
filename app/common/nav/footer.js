'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('FooterCtrl', [ '$scope', '$window', function ($scope, $window) {

        $scope.contactUs = function () {
            $window.location = 'ma' + 'il' + 'to' + ':con' + 'tact' + '@' + 'ortolang.fr';
        };
    }]);
