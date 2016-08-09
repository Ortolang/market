'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', '$translate', 'ReferentialResource', 'SearchProvider', function ($rootScope, $scope, $routeParams, $translate, ReferentialResource, SearchProvider) {

        function loadItem(id) {
            ReferentialResource.get({name: id}, function (refEntity) {
                $scope.producer = angular.fromJson(refEntity.content);
                $rootScope.ortolangPageTitle = $scope.producer.name + ' | ';
                $rootScope.ortolangPageDescription = $translate.instant('PRODUCER.META_DESCRIPTION_PRODUCER') + $scope.producer.fullname;

                if (!$scope.producer.img) {
                    $scope.title = $scope.producer.acronym ? $scope.producer.acronym.charAt(0) : $scope.producer.name.charAt(0);
                }
            });
        }

        function init() {
            $scope.producer = undefined;
            loadItem($routeParams.producerId);

            var metaLatestSnapshotPrefix = 'ortolang-workspace-json.latestSnapshot.';
            var metaItemPrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-item-json.';
            var metaWorkspacePrefix = 'ortolang-workspace-json.latestSnapshot.meta_ortolang-workspace-json.';
            var metaRatingPrefix = 'ortolang-workspace-json.latestSnapshot.meta_system-rating-json.';
            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('rank', false);
            $scope.params = '{"'+metaItemPrefix+'producers.meta_ortolang-referential-json.id[]": "' + $routeParams.producerId + '", "fields":"'+metaLatestSnapshotPrefix+'key,'+metaRatingPrefix+'score:rank,'+metaRatingPrefix+'.esrAccessibility,'+metaItemPrefix+'title,'+metaItemPrefix+'type,'+metaItemPrefix+'image,'+metaItemPrefix+'publicationDate,'+metaWorkspacePrefix+'wskey,'+metaWorkspacePrefix+'wsalias,'+metaWorkspacePrefix+'snapshotName"}';
        }
        init();
    }]);
