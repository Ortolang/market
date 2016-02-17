'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$scope', '$routeParams', 'icons', 'ReferentialEntityResource', function ($scope, $routeParams, icons, ReferentialEntityResource) {

        function loadItem(id) {

            ReferentialEntityResource.get({name: id}, function(refEntity) {
                $scope.producer = angular.fromJson(refEntity.content);

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
