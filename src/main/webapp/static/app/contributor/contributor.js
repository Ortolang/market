'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', 'ReferentialEntityResource', function ($rootScope, $scope, $routeParams, ReferentialEntityResource) {

        function loadItem(id) {

            ReferentialEntityResource.get({name: id}, function (refEntity) {
                $scope.contributor = angular.fromJson(refEntity.content);
                $rootScope.ortolangPageTitle = 'ORTOLANG | ' + $scope.contributor.fullname;
            });
        }

        function init() {
            $scope.contributor = undefined;
            loadItem($routeParams.contributorId);
            $scope.params = '{"contributors.entity.meta_ortolang-referential-json.id[]": "' + $routeParams.contributorId + '"}';
        }
        init();
    }]);
