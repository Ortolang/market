'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:MetadataEditorViewCtrl
 * @description
 * # MetadataEditorViewCtrl
 * Controller of the ortolangMarketApp
 *
 * @property {Array}   metadatas              - List of metadatas
 * @property {String}   metadataName              - The selected metadata name
 * @property {String}   elementName              - The selected element name
 * @property {String}   elementPath              - The selected element path
 */
angular.module('ortolangMarketApp').controller('MetadataEditorViewCtrl', 
	['$scope', 
		function($scope) {

            $scope.$watch('metadataEditorViewForm.$pristine', function () {
            	console.log($scope.metadataEditorViewForm.$pristine);
                if ($scope.metadataEditorViewForm.$pristine === false) {
                    $scope.selectedMetadata.changed = true;
                }
            }, true);

		}
	]
);