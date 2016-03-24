'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProductionsCtrl
 * @description
 * # ProductionsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProductionsCtrl', ['$scope', 'User', 'ObjectResource', 'Content',
        function ($scope, User, ObjectResource, Content) {
            $scope.loadProductions = function () {
                $scope.params = '{"contributors.entity.meta_ortolang-referential-json.username[]": "' + User.key + '"}';
            };
        }
]);
