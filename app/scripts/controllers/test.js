'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('TestCtrl', ['$scope', '$rootScope', '$modal', 'WorkspaceResource', function ($scope, $rootScope, $modal, WorkspaceResource) {
        $scope.fileSelectModal = $modal({title: 'File select test', template: 'views/file-select-test-template.html', show: false});

        $scope.wsList = WorkspaceResource.get();

        $rootScope.$on('browserSelectedElements', function ($event, elements) {
            $scope.elements = elements;
            $scope.fileSelectModal.hide();
        });

        $scope.select = function () {
            $rootScope.$emit('browserAskSelectedElements');
        };
    }]);
