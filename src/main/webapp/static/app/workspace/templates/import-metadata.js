'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ImportMetadataCtrl
 * @description
 * # ImportMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ImportMetadataCtrl', ['$rootScope', '$scope', '$timeout', 'Content', 'Workspace', 'ortolangType', '$location',
        function ($rootScope, $scope, $timeout, Content, Workspace, ortolangType, $location) {

        	$scope.upload = function () {
        		// Using $timeout to prevent '$apply already in progress' error
                $timeout(function () {
                    angular.element('#metadata-upload-file-select').click();
                });
        	};

        	$scope.download = function () {
        		if (angular.isDefined(Workspace.active.workspace.metadatas['ortolang-item-json'])) {
        			Content.downloadWithKeyInWindow(Workspace.active.workspace.metadatas['ortolang-item-json'], true);
        		}
        	};

            $rootScope.$on('uploader.metadata.create', function () {
                Workspace.refreshActiveWorkspaceMetadata().then(function() {
                    Workspace.getActiveWorkspaceMetadata().then(function() {

                        $scope.applying = false;
                        $location.search('section', 'preview');
                    });
                });
            });

            $rootScope.$on('uploader.metadata.update', function () {
                Workspace.refreshActiveWorkspaceMetadata().then(function() {
                    Workspace.getActiveWorkspaceMetadata().then(function() {

                        $scope.applying = false;
                        $location.search('section', 'preview');
                    });
                });
            });

        	function setContent(metadata) {
        		var metadata = angular.copy(metadata);
        		delete metadata.imageUrl;
        		$scope.content = angular.toJson(metadata, true);
        	}

        	function init () {
        		setContent($scope.metadata);
        		$scope.ortolangType = ortolangType;
        	}
        	init();
    	}]
    );