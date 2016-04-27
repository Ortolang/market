'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:ImportMetadataCtrl
 * @description
 * # ImportMetadataCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('ImportMetadataCtrl', ['$rootScope', '$scope', '$timeout', 'Content', 'Workspace', 'ortolangType', '$location', '$alert', '$translate',
        function ($rootScope, $scope, $timeout, Content, Workspace, ortolangType, $location, $alert, $translate) {

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

            $rootScope.$on('uploader.metadata.failed', function (event, response) {
            	console.log(response);
                var myAlert = $alert({
                	// title: $translate.instant('ERROR_MODAL_9.TITLE'),
                	content: $translate.instant('ERROR_MODAL_9.BODY'),
                	placement: 'top',
                	type: 'danger',
                	duration: 5,
                	show: true
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