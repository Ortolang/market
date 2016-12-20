'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:MetadataEditorViewCtrl
 * @description
 * # MetadataEditorViewCtrl
 * Controller of the ortolangMarketApp
 *
 */
angular.module('ortolangMarketApp').controller('MetadataEditorViewCtrl', 
	['$scope', 
		function($scope) {

            $scope.$watch('metadataEditorViewForm.$pristine', function () {
                //TODO dereference properly
                if ($scope.metadataEditorViewForm && $scope.metadataEditorViewForm.$pristine === false) {
                    $scope.selectedMetadata.changed = true;
                }
            }, true);

		}
	]
);