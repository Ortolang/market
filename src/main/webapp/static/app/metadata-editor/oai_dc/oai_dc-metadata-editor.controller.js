'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:OaiDcMetadataEditorCtrl
 * @description
 * # OaiDcMetadataEditorCtrl
 */
angular.module('ortolangMarketApp')
    .controller('OaiDcMetadataEditorCtrl', ['$scope', 'x2js', function ($scope, x2js) {

    	function init() {
    		$scope.textXml = '';
    		// if ($scope.selectedMetadata) {
    		// 	$scope.jsonOaiDc = $scope.selectedMetadata.content;
    		// } else {
    		// 	$scope.jsonOaiDc = {};
    		// }
    	}
    	init();
	}]);