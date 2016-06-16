'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:Applications
 * @description
 * # Applications
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ApplicationsCtrl', ['$scope', '$location', 'SearchProvider', function ($scope, $location, SearchProvider) {
        function init() {
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            var metaLatestSnapshotPrefix = 'ortolang-workspace-json.latestSnapshot.';
            var metaItemPrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.';
            var metaWorkspacePrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.';
            var metaRatingPrefix = 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.';
            $scope.params = '{"'+metaItemPrefix+'type": "Application", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'.esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName"}';
        }
        init();
    }]);
