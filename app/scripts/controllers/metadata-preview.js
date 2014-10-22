'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataPreviewCtrl
 * @description
 * # MetadataPreviewCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataPreviewCtrl', ['$scope', 'DownloadResource', function ($scope, DownloadResource) {

        $scope.loadMetadata = function (clickEvent, metadata) {
            $scope.selectedMetadata = metadata;
            DownloadResource.download({oKey: metadata.key}).success(function (data) {
                $scope.code = data;
                $('#metadata-modal').modal('show');
            }).error(function () {
                $scope.code = undefined;
            });
        };

        $scope.$on('metadata-preview', function (event, clickEvent, metadata) {
            $scope.loadMetadata(clickEvent, metadata);
        });
    }]);
