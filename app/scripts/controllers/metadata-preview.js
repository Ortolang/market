'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataPreviewCtrl
 * @description
 * # MetadataPreviewCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataPreviewCtrl', ['$scope', '$rootScope', '$http', 'Url', function ($scope, $rootScope, $http, Url) {

        function deselectMetadata(clickEvent) {
            if ($scope.selectedMetadata) {
                if (clickEvent) {
                    $(clickEvent.target).removeClass('active');
                } else {
                    $('.metadata-' + $scope.selectedMetadata.key).removeClass('active');
                }
                $scope.selectedMetadata = undefined;
                $scope.code = undefined;
            }
        }

        $scope.loadMetadata = function (clickEvent, metadata) {
            clickEvent.preventDefault();
            if ($scope.selectedMetadata === metadata) {
                deselectMetadata(clickEvent);
                return;
            }
            if ($scope.selectedMetadata) {
                $('.metadata-' + $scope.selectedMetadata.key).removeClass('active');
            }
            $(clickEvent.target).addClass('active');
            $scope.selectedMetadata = metadata;
            $http.get(Url.urlBase() + '/rest/objects/' + metadata.key + '/download').success(function (data) {
                $scope.code = data;
                $('#metadata-modal').modal('show');
            });
        };

        // When dismiss metadata modal: deselected selected metadata
        $('#metadata-modal').on('hide.bs.modal', function () {
            deselectMetadata();
        });

        $rootScope.$on('metadata-selected', function (event, clickEvent, metadata) {
            $scope.loadMetadata(clickEvent, metadata);
        });
    }]);
