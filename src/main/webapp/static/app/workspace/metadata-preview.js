'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataPreviewCtrl
 * @description
 * # MetadataPreviewCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataPreviewCtrl', ['$scope', 'Content', function ($scope, Content) {

        function previewMetadata(metadata) {
            $scope.selectedMetadata = metadata;

            return Content.downloadWithKey(metadata.key).success(function (data) {
                $scope.code = data;
                $scope.object = angular.fromJson(data);
                $('#metadata-modal').modal('show');
            }).error(function () {
                $scope.code = undefined;
            });
        }

        $scope.$on('metadata-preview', function (event, metadata) {
            previewMetadata(metadata);
        });
    }]);
