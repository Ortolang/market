'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormMarketOrtolangCtrl
 * @description
 * # MetadataFormMarketOrtolangCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataFormMarketOrtolangCtrl', ['$scope', '$rootScope', '$modal', 'N3Serializer', 'ObjectResource', function ($scope, $rootScope, $modal, N3Serializer, ObjectResource) {

        $scope.categories = [{id: 'Corpora', label: 'Corpus'}, {id: 'Lexicon', label: 'Lexique'}];
        $scope.useConditions = [{id: 'free', label: 'Libre'}, {id: 'free-nc', label: 'Libre sans usage commercial'}, {id: 'restricted', label: 'Négociation nécessaire'}];

        $scope.submit = function (form, md) {
            $scope.$broadcast('show-errors-check-validity');

            if (form.$invalid) {
                console.debug('not ready');
                return;
            }

            var content = N3Serializer.toN3(md),
                contentType = 'text/n3';

            $rootScope.$broadcast('metadata-editor-create', content, contentType);
        };

        var fileSelectModalScope = $rootScope.$new(true);
        fileSelectModalScope.acceptMultiple = false;
        fileSelectModalScope.forceMimeTypes = 'ortolang/collection';
        fileSelectModalScope.forceWorkspace = $scope.wsName;
        $scope.fileSelectModal = $modal({scope: fileSelectModalScope, title: 'File select test', template: 'common/directives/file-select-modal-template.html', show: false});

        $rootScope.$on('browserSelectedElements', function ($event, elements) {
            console.debug('on browserSelectedElements');
            angular.forEach(elements, function (element) {
                console.log(element);
            });
            if (!$scope.md) {
                $scope.md = {};
            }
            $scope.md.preview = elements[0].key;
            $scope.preview = elements[0];
            $scope.fileSelectModal.hide();
        });


        if ($scope.selectedMetadataContent !== undefined) {
            var mdFromN3 = N3Serializer.fromN3($scope.selectedMetadataContent);
            mdFromN3.then(function (data) {
                $scope.md = angular.copy(data);
                ObjectResource.get({oKey: $scope.md.preview}).$promise.then(function (data) {
                    $scope.preview = data.object;
                });
            });
        }


    }]);
