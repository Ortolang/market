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
	['$rootScope', '$scope', '$q', '$filter', '$timeout', 'x2js', '$alert', '$modal', '$translate', 'Content', 'ortolangType', 'icons', 'Workspace', 'WorkspaceElementResource', 
		function($rootScope, $scope, $q, $filter, $timeout, x2js, $alert, $modal, $translate, Content, ortolangType, icons, Workspace, WorkspaceElementResource) {

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
			function loadMetadataFromKey(key) {
				var deferred = $q.defer();
				Content.downloadWithKey(key).promise.then(function (data) {
		            deferred.resolve(data.data);
		        }, function (reason) {
		        	deferred.reject(reason);
		        });
		        return deferred.promise;
			}

			function setModeSource(source) {
				$scope.modeSource = source;
			}

			//TODO move to an angular service
			function initOaiDcContent(metadata) {
				metadata.content = {
					title: [{value: ''}],
					description: [{value: ''}]
				};
			}

			function setMetadataEditorView(source) {
				if ($scope.selectedMetadata) {
					setModeSource(source);
					if (source) {
						$scope.mainContainer = 'metadata-editor/source-editor.template.html';
						return;
					}
					switch($scope.selectedMetadata.name) {
						case 'oai_dc':
							$scope.mainContainer = 'metadata-editor/oai_dc/oai_dc-metadata-editor.html';
							if (angular.isUndefined($scope.selectedMetadata.content)) {
								initOaiDcContent($scope.selectedMetadata);
							}
							// $scope.oaiDc = $scope.selectedMetadata.content;
							break;
						default:
		        			$scope.source();
					}
		        } else {
		        	$scope.create();
		        }
			}

            function postForm(metadata, metadataName, deferred) {
                var fd = new FormData(),
                	blob = new Blob([metadata], { type: 'text/json'});
                fd.append('path', $scope.elementPath);
                fd.append('type', ortolangType.metadata);
                fd.append('name', metadataName);
                fd.append('stream', blob);

                WorkspaceElementResource.post({wskey: Workspace.active.workspace.key}, fd, function (element) {
                    deferred.resolve(element);
                }, function (errors) {
                    deferred.reject(errors);
                });
                return deferred.promise;
            }

            /**
             * Converts a XML OAI_DC (String representation) to JSON.
             **/
	    	function convertXMLToJsonOaiDc (metadata) {
				var doc = x2js.xml_str2json(metadata),
					content = {};
				console.log(doc);
				if (angular.isDefined(doc.olac)) {
					if (angular.isDefined(doc.olac.title)) {
						content.title = [
							{
								value: doc.olac.title.__text
							}
						];
					}
				} else {
					console.log('XML parser error : root element not found or not a dc element');
				}
				return content;
	    	}

			/**
			 * Sets the metadata format viewer.
			 **/
			$scope.selectMetadataByName = function (name) {
				var refMetadata = findMetadata(name);
				if (refMetadata !== null) {
					if (angular.isDefined(refMetadata.key) && angular.isUndefined(refMetadata.content)) {
						// Loads into content property
						loadMetadataFromKey(refMetadata.key).then(
							function (data) {
								refMetadata.content = angular.fromJson(data);
								$scope.selectedMetadata = refMetadata;
								setMetadataEditorView();
							},
							function (reason) {
								//TODO alert
		        				console.log(reason);
							}
						);
					} else {
						$scope.selectedMetadata = refMetadata;
						setMetadataEditorView();
					}
				} else {
					//TODO show message to user 
					console.log('enable to download metadata name : {name}');
				}
			};

			/**
			 * Shows the metadata source.
			 **/
			$scope.source = function () {
				$scope.jsonSource = angular.toJson($scope.selectedMetadata.content, true);
				setMetadataEditorView(!$scope.modeSource);
			};

			/**
			 * Creates and adds a new metadata based on the metadataFormat.
			 **/
			$scope.create = function (metadataFormat) {
				$scope.metadatas.push({name: metadataFormat, changed: true});
				$scope.selectMetadataByName(metadataFormat);
			};

			/**
			 * Uploads a file for creating a new metadata format
			 **/
			$scope.uploadFromFile = function () {
				//TODO
			};

			$scope.uploadFromOrtolang = function () {
				$scope.fileMetadataPathSelectorModal.show();
			};

			$scope.convertFromFile = function () {
				//TODO
			};

			$scope.convertFromOrtolang = function () {
				$scope.fileToConvertSelectorModal.show();
			};

			/**
			 * Saves the current selected metadata.
			 **/
			$scope.save = function () {
				var deferred = $q.defer();
				// Creates/Updates in the server
				postForm(angular.toJson($scope.selectedMetadata.content), $scope.selectedMetadata.name, deferred).then(
       				function (metadataObject) {
       					var md = findMetadata(metadataObject.name);
       					if (md !== null) {
       						$scope.selectedMetadata.key = metadataObject.key;
       					}
       					md.changed = false;
           			}, function (reason) {
           				console.log(reason);
           			}
           		);
			};

        	$scope.download = function () {
        		if (angular.isDefined($scope.selectedMetadata)) {
        			Content.downloadWithKeyInWindow($scope.selectedMetadata.key);
        		}
        	};

            // Loads a data object to the content
            var deregisterFileMetadataPathSelectorModal = $rootScope.$on('browserSelectedElements-fileMetadataPathSelectorModal', function ($event, elements) {
               if(elements.length>0) {
               		Content.downloadWithKey(elements[0].key).promise.then(function (data) {
               			// Loads
               			$scope.selectedMetadata.content = angular.fromJson(data.data);
               			$scope.selectedMetadata.changed = true;
               			$scope.selectMetadataByName($scope.selectedMetadata.name);
			        }, function (reason) {
						//TODO show message to user
			        	console.log(reason);
			        });
                    $scope.fileMetadataPathSelectorModal.hide();
                }
            });

            // Converts a data object to the content
            var deregisterFileToConvertSelectorModal = $rootScope.$on('browserSelectedElements-fileToConvertSelectorModal', function ($event, elements) {
               if(elements.length>0) {
               		Content.downloadWithKey(elements[0].key).promise.then(function (data) {
               			// Convert
               			$scope.selectedMetadata.content = convertXMLToJsonOaiDc(data.data);
               			$scope.selectMetadataByName($scope.selectedMetadata.name);
						$scope.selectedMetadata.changed = true;
			        }, function (reason) {
						//TODO show message to user
			        	console.log(reason);
			        });
                    $scope.fileToConvertSelectorModal.hide();
                }
            });

            $scope.$on('$destroy', function () {
                deregisterFileMetadataPathSelectorModal();
                deregisterFileToConvertSelectorModal();
            });

			(function init() {
		        $scope.Workspace = Workspace;
		        $scope.ortolangType = ortolangType;
		        $scope.icons = icons;
		        // Tells if we show the code source 
		        $scope.modeSource = false;
		        
		        if ($scope.metadataName) {
		        	$scope.selectMetadataByName($scope.metadataName);
		        } else {
		        	if ($scope.metadatas.length>0) {
		        		$scope.selectMetadataByName($scope.metadatas[0].name);
		        	}
		        }

		        // Ortolang file selector used to LOAD a data object
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
                // Ortolang file selector used to CONVERT a data object
                var fileToConvertSelectorModalScope = $rootScope.$new();
                fileToConvertSelectorModalScope.acceptMultiple = false;
                fileToConvertSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileToConvertSelectorModalScope.forceHead = true;
                fileToConvertSelectorModalScope.fileSelectId = 'fileToConvertSelectorModal';
                $scope.fileToConvertSelectorModal = $modal({scope: fileToConvertSelectorModalScope,
                	title: 'Sélectionnez un fichier de métadonnées XML',
                	templateUrl: 'browser/browser-file-select-modal-template.html',
                	show: false
                });

		    }());
		}
	]
);