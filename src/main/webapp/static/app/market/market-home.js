'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketHomeCtrl
 * @description
 * # MarketHomeCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketHomeCtrl', ['$scope', '$location', 'ObjectResource', function ($scope, $location, ObjectResource) {

        $scope.search = function () {
            if ($scope.content !== '') {
                $location.search('content', $scope.content).path('/search');
            }
        };

        $scope.clickItem = function (entry) {
            $location.path('/market/' + entry.key);
        };

        function loadObjects() {
            // Loads all objects
            ObjectResource.get({items: 'true', status: 'PUBLISHED'}).$promise.then(function (oobjects) {

                angular.forEach(oobjects.entries, function (entry) {
                    $scope.items.push({key: entry});
                });
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.items = [];
            $scope.content = '';
        }

        function init() {
            initScopeVariables();
            loadObjects();
        }
        init();

    }]);
