'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ContributorCtrl
 * @description
 * # ContributorCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ContributorCtrl', ['$rootScope', '$scope', '$routeParams', '$filter', 'ReferentialEntityResource', 'SearchResource', 'SearchProvider', 'Helper', function ($rootScope, $scope, $routeParams, $filter, ReferentialEntityResource, SearchResource, SearchProvider, Helper) {

        function loadItem(id) {
            SearchResource.getEntity({id: id}, function (entity) {
                $scope.contributor = entity['meta_ortolang-referential-json'];
                if ($scope.contributor.username) {
                    $scope.presentation = $scope.contributor.username.meta_profile.infos.presentation;
                    $scope.emailHash = $scope.contributor.username.meta_profile.emailhash;
                    $scope.idHal = $scope.contributor.username.meta_profile.infos.idhal;
                }
                if ($scope.contributor.organization) {
                    $scope.contributor.organizationEntity = $scope.contributor.organization['meta_ortolang-referential-json'];
                }

                $rootScope.ortolangPageTitle = $scope.contributor.fullname + ' | ';
            }, function () {
                // If not found in json-store, then go to relational db
                ReferentialEntityResource.get({name: id}, function (entity) {
                    var content = angular.fromJson(entity.content);
                    $scope.contributor = content;

                    if (content.organization) {
                        ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(content.organization)}, function (entity) {
                            var contentOrganization = angular.fromJson(entity.content);
                            $scope.contributor.organizationEntity = contentOrganization;
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

            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            $scope.params = '{"contributors.entity.meta_ortolang-referential-json.id[]": "' + $routeParams.contributorId + '", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,item.producers,workspace.wskey,workspace.wsalias,workspace.snapshotName"}';
        }
        init();
    }]);
