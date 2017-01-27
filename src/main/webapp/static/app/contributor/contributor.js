'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', 'ReferentialResource', 'SearchResource', 'SearchProvider', 'Helper', function ($rootScope, $scope, $routeParams, $filter, ReferentialResource, SearchResource, SearchProvider, Helper) {

        function loadItem(id) {
            SearchResource.getPerson({key: 'referential:' + id}, function (entity) {
                $scope.contributor = entity;
                if ($scope.contributor.username) {
                    /*jshint camelcase:false */
                    $scope.emailHash = $scope.contributor.username.meta_profile.emailHash;
                    $scope.infos = $scope.contributor.username.meta_profile.infos;
                }
                if ($scope.contributor.organization) {
                    $scope.contributor.organizationEntity = $scope.contributor.organization;
                }

                $rootScope.ortolangPageTitle = $scope.contributor.fullname + ' | ';
            }, function () {
                // If not found in json-store, then go to relational db
                ReferentialResource.get({name: id}, function (entity) {
                    var content = angular.fromJson(entity.content);
                    $scope.contributor = content;

                    if (content.organization) {
                        ReferentialResource.get({name: Helper.extractNameFromReferentialId(content.organization)}, function (entity) {
                            $scope.contributor.organizationEntity = angular.fromJson(entity.content);
                        });
                    }
                }, function () {
                    $scope.contributor = {fullname: id};
                });
            });
        }

        function init() {
            $scope.activeTab = 0;
            $scope.contributor = undefined;

            loadItem($routeParams.contributorId);

            // var metaLatestSnapshotPrefix = 'ortolang-workspace-json.latestSnapshot.';
            // var metaItemPrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.';
            // var metaWorkspacePrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.';
            // var metaRatingPrefix = 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.';
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('rank', false);
            // $scope.params = '{"'+metaItemPrefix+'contributors.entity.meta_ortolang-referential-json.id[]": "' + $routeParams.contributorId + '", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'.esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName"}';
            $scope.params = {'contributors.entity.id[]': $routeParams.contributorId};
        }
        init();
    }]);
