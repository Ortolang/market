'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducersCtrl
 * @description
 * # ProducersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducersCtrl', ['$scope', 'ReferentialEntityResource', function ($scope, ReferentialEntityResource) {

        $scope.getAllOrganizations = function () {
            ReferentialEntityResource.get({type: 'ORGANIZATION'}, function (collectionEntities) {
                angular.forEach(collectionEntities.entries, function (entry) {
                    var content = angular.fromJson(entry.content);
                    if (angular.isUndefined(content.compatibilities)) {
                        $scope.producers.push({key: entry.key, content: content});
                    }
                });
                $scope.processing = false;
            });
        };

        function init() {
            $scope.models = {};
            $scope.producers = [];
            $scope.processing = true;
            $scope.getAllOrganizations();
        }
        init();

    }]);
