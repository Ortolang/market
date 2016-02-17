'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$scope', '$routeParams', 'icons', 'ReferentialEntityResource', function ($scope, $routeParams, icons, ReferentialEntityResource) {

        function loadItem(id) {

            ReferentialEntityResource.get({name: id}, function(refEntity) {
                $scope.contributor = angular.fromJson(refEntity.content);
            });
        }

        function init() {
            $scope.contributor = undefined;
            loadItem($routeParams.contributorId);
            $scope.params = '{"contributors.entity.meta_ortolang-referential-json.id[]": "'+$routeParams.contributorId+'"}';
        }
        init();
    }]);
