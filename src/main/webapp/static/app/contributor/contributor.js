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
                    $scope.emailHash = $scope.contributor.username.emailHash;
                    $scope.infos = $scope.contributor.username.infos;
                }
                if ($scope.contributor.organization) {
                    $scope.contributor.organizationEntity = $scope.contributor.organization;
                }

                $rootScope.ortolangPageTitle = $scope.contributor.fullname + ' | ';
            }, function () {
                // If not found in json-store, then go to relational db
                ReferentialResource.get({name: id}, function (entity) {
                    $scope.contributor = entity.content;

                    if (entity.content.organization) {
                        ReferentialResource.get({name: Helper.extractNameFromReferentialId(entity.content.organization)}, function (entity) {
                            $scope.contributor.organizationEntity = entity.content;
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
            $scope.search.setActiveOrderProp('rank', false);
            $scope.params = {'contributors.entity.id[]': $routeParams.contributorId, archive: false, includes: Helper.includedItemFields, orderProp: 'rank', orderDir: 'desc'};
        }
        init();
    }]);
