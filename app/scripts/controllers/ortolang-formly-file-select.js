'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangFormlyFileSelectCtrl
 * @description
 * # OrtolangFormlyFileSelectCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangFormlyFileSelectCtrl', ['$scope', '$rootScope', '$modal', function ($scope, $rootScope, $modal) {

        var fileSelectModalScope = $rootScope.$new();
        fileSelectModalScope.acceptMultiple = false;
        //fileSelectModalScope.forceMimeTypes = 'ortolang/collection';
        $scope.fileSelectModal = $modal({scope: fileSelectModalScope, title: 'File select test', template: 'views/file-select-modal-template.html', show: false});

        $rootScope.$on('browserSelectedElements', function ($event, elements) {
            console.debug('on browserSelectedElements', elements);
            $scope.value = elements[0].key;
            $scope.displayedValue = elements[0];
            $scope.fileSelectModal.hide();
        });
    }]);
