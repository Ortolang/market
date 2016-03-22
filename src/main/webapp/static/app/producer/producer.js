'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', 'ReferentialEntityResource', function ($rootScope, $scope, $routeParams, ReferentialEntityResource) {

        function loadItem(id) {

            ReferentialEntityResource.get({name: id}, function (refEntity) {
                $scope.producer = angular.fromJson(refEntity.content);
                $rootScope.ortolangPageTitle = $scope.producer.name + ' | ';

                if (!$scope.producer.img) {
                    $scope.title = $scope.producer.acronym ? $scope.producer.acronym.charAt(0) : $scope.producer.name.charAt(0);
                }
            });
        }

        function init() {
            $scope.producer = undefined;
            loadItem($routeParams.producerId);
            $scope.params = '{"producers.meta_ortolang-referential-json.id[]": "' + $routeParams.producerId + '"}';
        }
        init();
    }]);
