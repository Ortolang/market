'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', 'ReferentialEntityResource', 'SearchResource', 'Helper', function ($rootScope, $scope, $routeParams, ReferentialEntityResource, SearchResource, Helper) {

        function loadItem(id) {
            ReferentialEntityResource.get({name: id}, function (refEntity) {
                $scope.contributor = angular.fromJson(refEntity.content);
                if ($scope.contributor.username) {
                    SearchResource.findProfiles({content:$scope.contributor.username, field: 'key'}, function (profile) {
                        if (profile.length>0 && profile[0].meta_profile && profile[0].meta_profile.infos) {
                            $scope.presentation = profile[0].meta_profile.infos.presentation;
                        }
                    });
                }
                if ($scope.contributor.organization) {
                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId($scope.contributor.organization)}, function (refEntity) {
                        $scope.contributor.organizationEntity = angular.fromJson(refEntity.content);
                    });
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
