'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducerCtrl
 * @description
 * # ProducerCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducerCtrl', ['$rootScope', '$scope', '$routeParams', 'QueryBuilderFactory', 'JsonResultResource', function ($rootScope, $scope, $routeParams, QueryBuilderFactory, JsonResultResource) {

        function loadItem(id) {

            var queryBuilder = QueryBuilderFactory.make({projection: '*', source: 'Organization'});
            queryBuilder.equals('id', id);

            // var queryStr = 'select * from collection where status = \'published\' and key = \''+key+'\' ';
            console.log(queryBuilder.toString());
            JsonResultResource.get({query: queryBuilder.toString()}).$promise.then(function (jsonResults) {
                if(jsonResults.length===1) {

                    $scope.producer = angular.fromJson(jsonResults[0]);

                    if(!$scope.producer.img) {
                        $scope.imgtitle = '';
                        $scope.imgtheme = 'custom';
                        if($scope.producer.title) {
                            $scope.imgtitle = $scope.producer.title.substring(0,2);
                            $scope.imgtheme = $scope.producer.title.substring(0,1).toLowerCase();
                        }
                    }
                }
            }, function (reason) {
                console.error(reason);
            });
        }

        // Scope variables
        function initScopeVariables() {
            $scope.producer = undefined;
        }

        function init() {
            initScopeVariables();
            loadItem($routeParams.producerId);
        }

        init();

    }]);
