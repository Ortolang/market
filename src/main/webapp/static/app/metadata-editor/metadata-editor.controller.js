'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:MetadataEditorCtrl
 * @description
 * # MetadataEditorCtrl
 * Controller of the ortolangMarketApp
 *
 * @property {Array}   metadatas              - List of metadatas
 * @property {String}   metadataName              - The selected metadata name
 * @property {String}   elementName              - The selected element name
 * @property {String}   elementPath              - The selected element path
 */
angular.module('ortolangMarketApp').controller('MetadataEditorCtrl', 
	['$rootScope', '$scope', '$q', '$filter', '$timeout', '$alert', '$modal', '$translate', 'Content', 'ortolangType', 'icons', 'Workspace', 'WorkspaceElementResource', 
		function($rootScope, $scope, $q, $filter, $timeout, $alert, $modal, $translate, Content, ortolangType, icons, Workspace, WorkspaceElementResource) {

			/**
			 * Finds a metadata by it name.
			 **/
			function findMetadata(name) {
				var metadataFound = $filter('filter')($scope.metadatas, {name: name});
				if (metadataFound.length>0) {
					return metadataFound[0];
				} else {
					return null;
				}
			}

			/**
			 * Loads the metadata.
			 **/
			function loadMetadata(md) {
				Content.downloadWithKey(md.key).promise.then(function (data) {
		            md.metadata = angular.fromJson(data.data);
		            md.content = angular.toJson(md.metadata, true);
		        }, function (reason) {
					//TODO show message to user
		        	console.log(reason);
		        });
			}

			function initMetadataEditorView() {
				if ($scope.selectedMetadata) {
					switch($scope.selectedMetadata.name) {
						case 'oai_dc':
							$scope.mainContainer = 'metadata-editor/oai_dc/oai_dc-metadata-editor.html';
							break;
						default:
		        			$scope.source();
					}
		        } else {
		        	$scope.create();
		        }
			}

			/**
			 * Sets the metadata format viewer.
			 **/
			$scope.selectMetadataByName = function (name) {
				var refMetadata = findMetadata(name);
				if (refMetadata !== null) {
					if (angular.isUndefined(refMetadata.metadata)) {
						loadMetadata(refMetadata);
					}
					$scope.selectedMetadata = refMetadata;
					initMetadataEditorView();
				} else {
					//TODO show message to user 
					console.log('enable to download metadata name : {name}');
				}
			};

			$scope.source = function () {
				$scope.mainContainer = 'metadata-editor/source-editor.template.html';
			};

			/**
			 * Shows wizzard for creating a new metadata format
			 **/
			$scope.create = function () {
				$scope.mainContainer = 'metadata-editor/wizzard.template.html';
			};

			/**
			 * Uploads a file for creating a new metadata format
			 **/
			$scope.upload = function () {
				// Using $timeout to prevent '$apply already in progress' error
		        $timeout(function () {
		            angular.element('#metadata-editor-upload-file-select').click();
		        });
			};

        	$scope.download = function () {
        		if (angular.isDefined($scope.selectedMetadata)) {
        			Content.downloadWithKeyInWindow($scope.selectedMetadata.key);
        		}
        	};

            function postForm(metadata, deferred) {

                // var deferred = $q.defer();
                var fd = new FormData();

                fd.append('path', $scope.elementPath);
                fd.append('type', ortolangType.metadata);
                fd.append('name', $scope.newMetadataFormat.name);
                // if (WorkspaceMetadataService.format !== null) {
                //     fd.append('format', WorkspaceMetadataService.format.id);
                // }

                var blob = new Blob([metadata], { type: 'text/json'});

                fd.append('stream', blob);

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function (element) {
                    deferred.resolve(element);
                }, function (errors) {
                    deferred.reject(errors);
                });
                return deferred.promise;
            }

            $rootScope.$on('uploader.metadata.create', function (event, response) {
            	$scope.metadatas.push({name: response.name, key: response.key});
		        $scope.selectMetadataByName(response.name);
            });

            $rootScope.$on('uploader.metadata.update', function (event, response) {
                $scope.selectMetadataByName(response.name);
            });

            $rootScope.$on('uploader.metadata.failed', function (event, response) {
            	console.log(response);
                $alert({
                	content: $translate.instant('ERROR_MODAL_9.BODY'),
                	placement: 'top',
                	type: 'danger',
                	duration: 5,
                	show: true
                });
            });

            var deregisterFileMetadataPathSelectorModal = $rootScope.$on('browserSelectedElements-fileMetadataPathSelectorModal', function ($event, elements) {
               if(elements.length>0) {
               		Content.downloadWithKey(elements[0].key).promise.then(function (data) {
               			var deferred = $q.defer();
               			postForm(data.data, deferred).then(
               				function (metadataObject) { 
               					$scope.metadatas.push({name: metadataObject.name, key: metadataObject.key});
		        				$scope.selectMetadataByName(metadataObject.name);
	               			}, function (reason) {
	               				console.log(reason);
	               			}
	               		);
			        }, function (reason) {
						//TODO show message to user
			        	console.log(reason);
			        });
                    $scope.fileMetadataPathSelectorModal.hide();
                }
            });

            $scope.$on('$destroy', function () {
                deregisterFileMetadataPathSelectorModal();
            });

			(function init() {
		        if ($scope.metadataName) {
		        	$scope.selectMetadataByName($scope.metadataName);
		        } else {
		        	if ($scope.metadatas.length>0) {
		        		$scope.selectMetadataByName($scope.metadatas[0].name);
		        	} else {
		        		$scope.mainContainer = 'metadata-editor/wizzard.template.html';
		        	}
		        }
		        $scope.Workspace = Workspace;
		        $scope.ortolangType = ortolangType;
		        $scope.newMetadataFormat = {name: 'oai_dc'};
		        $scope.icons = icons;

                var fileMetadataPathSelectorModalScope = $rootScope.$new();
                fileMetadataPathSelectorModalScope.acceptMultiple = false;
                fileMetadataPathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileMetadataPathSelectorModalScope.forceHead = true;
                fileMetadataPathSelectorModalScope.fileSelectId = 'fileMetadataPathSelectorModal';
                $scope.fileMetadataPathSelectorModal = $modal({scope: fileMetadataPathSelectorModalScope,
                	title: 'Sélectionnez un fichier de métadonnées',
                	templateUrl: 'browser/browser-file-select-modal-template.html',
                	show: false
                });

		    }());
		}
	]
);