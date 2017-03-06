'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', '$translate', 'ReferentialResource', 'SearchProvider', 'Helper', function ($rootScope, $scope, $routeParams, $translate, ReferentialResource, SearchProvider, Helper) {

        function loadItem(id) {
            //TODO Use SearchResource.getOrganization
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

            $scope.search = SearchProvider.make();
            $scope.search.setActiveOrderProp('rank', false);
            $scope.params = {'producers.id[]': $routeParams.producerId, archive: false, includes: Helper.includedItemFields, orderProp: 'rank', orderDir: 'desc'};
        }
        init();
    }]);
