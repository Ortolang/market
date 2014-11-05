'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TestCtrl', ['$scope', '$rootScope', '$filter', '$modal', 'WorkspaceResource', function ($scope, $rootScope, $filter, $modal, WorkspaceResource) {
        $scope.fileSelectModal = $modal({title: 'File select test', template: 'views/file-select-modal-template.html', show: false});

        $scope.wsList = WorkspaceResource.get();

        $rootScope.$on('browserSelectedElements', function ($event, elements) {
            console.debug('on browserSelectedElements');
            angular.forEach(elements, function (element) {
                console.log(element);
            });
            //if ($filter('filter')(elements, {mimeType: 'ortolang/collection'}, true).length === 0) {
                $scope.elements = elements;
                $scope.fileSelectModal.hide();
            //}
        });
    }]);
