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
                $rootScope.ortolangPageTitle = 'ORTOLANG | ' + $scope.producer.name;

                if (!$scope.producer.img) {
                    $scope.imgtitle = '';
                    $scope.imgtheme = 'custom';
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
