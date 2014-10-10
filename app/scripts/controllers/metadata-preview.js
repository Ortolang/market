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

        function buildSelectedMetadataDeleteUrl(metadata) {
            var path = $scope.element.path;
            if ($scope.selectedChild) {
                path += '/' + $scope.selectedChild.name;
            }
            return Url.urlBase() + '/rest/workspaces/' + $scope.wsName + '/elements?path=' + path + '&metadataname=' + metadata.name + '&root=head';
        }

        $scope.deleteMetadata = function (metadata) {
            $http.delete(buildSelectedMetadataDeleteUrl(metadata)).success(function () {
                $scope.selectedMetadata = undefined;
            });
        };

        $scope.loadMetadata = function (clickEvent, metadata) {
            $scope.selectedMetadata = metadata;
            $http.get(Url.urlBase() + '/rest/objects/' + metadata.key + '/download').success(function (data) {
                $scope.code = data;
                $('#metadata-modal').modal('show');
            }).error(function () {
                $scope.code = undefined;
            });
        };

        $scope.$on('metadata-preview', function (event, clickEvent, metadata) {
            $scope.loadMetadata(clickEvent, metadata);
        });

        $scope.$on('metadata-delete', function (event, metadata) {
            $scope.deleteMetadata(metadata);
        });
    }]);
