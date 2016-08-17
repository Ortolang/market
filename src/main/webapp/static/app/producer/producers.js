'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ProducersCtrl
 * @description
 * # ProducersCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ProducersCtrl', ['$rootScope', '$scope', '$location', '$translate', 'ReferentialResource', function ($rootScope, $scope, $location, $translate, ReferentialResource) {

        $scope.getAllOrganizations = function () {
            ReferentialResource.get({type: 'ORGANIZATION'}, function (collectionEntities) {
                angular.forEach(collectionEntities.entries, function (entry) {
                    var content = angular.fromJson(entry.content);
                    if (angular.isUndefined(content.compatibilities)) {
                        var producer = {key: entry.key, content: content};
                        producer.title = content.acronym ? content.acronym.charAt(0) : content.name.charAt(0);
                        $scope.producers.push(producer);
                    }
                });
                $rootScope.ortolangPageDescription = $translate.instant('PRODUCER.META_DESCRIPTION_PRODUCERS');
                $scope.processing = false;
            });
        };

        $scope.producerOrder = function (producer) {
            return producer.content.acronym || producer.content.name;
        };

        $scope.showProducer = function (producer, $event) {
            if (!angular.element($event.target).is('a')) {
                if (angular.element($event.target).hasClass('city')) {
                    $scope.models.query = producer.content.city;
                } else {
                    $location.url('producers/' + producer.content.id);
                }
            }
        };

        $scope.toggleViewMode = function () {
            $scope.models.viewMode = $scope.models.viewMode === 'tile' ? 'line' : 'tile';
        };

        $scope.seeMoreProducers = function () {
            if ($scope.models.viewMode === 'tile' && $scope.models.limit < $scope.producers.length) {
                $scope.models.limit += 30;
            }
        };

        function init() {
            $scope.models = {
                viewMode: 'line',
                limit: 30
            };
            $scope.producers = [];
            $scope.processing = true;
            $scope.getAllOrganizations();
        }
        init();

    }]);
