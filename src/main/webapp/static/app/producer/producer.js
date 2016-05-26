'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', '$translate', 'ReferentialEntityResource', 'SearchProvider', function ($rootScope, $scope, $routeParams, $translate, ReferentialEntityResource, SearchProvider) {

        function loadItem(id) {
            ReferentialEntityResource.get({name: id}, function (refEntity) {
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

            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('publicationDate', true);
            $scope.params = '{"producers.meta_ortolang-referential-json.id[]": "' + $routeParams.producerId + '", "fields":"key,item.title,item.type,item.description,item.image,item.publicationDate,item.producers,workspace.wskey,workspace.wsalias,workspace.snapshotName"}';
        }
        init();
    }]);
