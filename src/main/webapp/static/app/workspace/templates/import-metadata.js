'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ImportMetadataCtrl
 * @description
 * # ImportMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ImportMetadataCtrl', ['$rootScope', '$scope', 'Content', 'Workspace',
        function ($rootScope, $scope, Content, Workspace) {

        	$scope.upload = function () {

        	};

        	$scope.download = function () {
        		if (angular.isDefined(Workspace.active.workspace.metadatas['ortolang-item-json'])) {
        			Content.downloadWithKeyInWindow(Workspace.active.workspace.metadatas['ortolang-item-json'], true);
        		}
        	};

        	function init () {
        		$scope.content = angular.toJson($scope.metadata, true);
        	}
        	init();
    	}]
    );