'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', 'ReferentialEntityResource', 'SearchResource', function ($rootScope, $scope, $routeParams, ReferentialEntityResource, SearchResource) {

        function loadItem(id) {
            SearchResource.getEntity({id: id}, function (entity) {
                $scope.contributor = entity['meta_ortolang-referential-json'];
                if ($scope.contributor.username) {
                    $scope.presentation = $scope.contributor.username.meta_profile.infos.presentation;
                }
                if ($scope.contributor.organization) {
                    $scope.contributor.organizationEntity = $scope.contributor.organization['meta_ortolang-referential-json'];
                }

                $rootScope.ortolangPageTitle = $scope.contributor.fullname + ' | ';
            });
        }

        function init() {
            $scope.activeTab = 0;
            $scope.contributor = undefined;

            loadItem($routeParams.contributorId);
            $scope.params = '{"contributors.entity.meta_ortolang-referential-json.id[]": "' + $routeParams.contributorId + '"}';
        }
        init();
    }]);
