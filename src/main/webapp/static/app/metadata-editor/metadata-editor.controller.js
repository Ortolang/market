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
	['$rootScope', '$scope', '$q', '$filter', '$timeout', 'x2js', '$alert', '$modal', '$translate', 'Content', 'ortolangType', 'icons', 'Workspace', 'WorkspaceElementResource', 'Helper',
		function($rootScope, $scope, $q, $filter, $timeout, x2js, $alert, $modal, $translate, Content, ortolangType, icons, Workspace, WorkspaceElementResource, Helper) {

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

			function setMetadataEditorView(source) {
				if ($scope.selectedMetadata) {
					setModeSource(source);
					if (source) {
						$scope.mainContainer = 'metadata-editor/source-editor.template.html';
						return;
					}
					if ($scope.metadataFormats[$scope.selectedMetadata.name]) {
						$scope.mainContainer = $scope.metadataFormats[$scope.selectedMetadata.name].template;
					} else {
						$scope.source();
					}
		        }
			}

            function postForm(metadata, metadataName, deferred) {
                var fd = new FormData(),
                	blob = new Blob([metadata], { type: 'text/json'});
                if (!deferred) {
                	deferred = $q.defer();
                }
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

	    	function saveAndUpdate(md, deferred) {
	    		postForm(angular.toJson(md.content), md.name).then(
       				function (metadataObject) {
       					if (md !== null) {
       						md.key = metadataObject.key;
       					}
       					md.changed = false;
       					deferred.resolve();
           			}, function (reason) {
           				console.log('save and update reject ' + md.name);
           				console.log(reason);
           				deferred.reject(reason);
           			}
           		);
	    	}

            /**
             * Converts a XML OAI_DC (String representation) to JSON.
             **/
	    	function convertXMLToJsonOaiDc (metadata) {
				var doc = x2js.xml_str2json(metadata),
					content = {};
				console.log(doc);
				if (angular.isDefined(doc.dc)) {
					for (var dcElementName in $scope.dcElementsObject) {
						if (angular.isDefined(doc.dc[dcElementName])) {
							content[dcElementName] = [];
							if (angular.isArray(doc.dc[dcElementName])) {
								for(var iElm=0 ; iElm<doc.dc[dcElementName].length ; iElm++) {
									content[dcElementName].push({
										value: doc.dc[dcElementName][iElm].__text,
										lang: doc.dc[dcElementName][iElm]['_xml:lang']
									});
								}
							} else {
								content[dcElementName].push({
									value: doc.dc[dcElementName].__text,
									lang: doc.dc[dcElementName]['_xml:lang']
								});
							}
						}
					}
				} else {
					console.log('XML parser error : root element not found or not a dc element');
				}
				return content;
	    	}

            /**
             * Converts a XML OLAC (String representation) to JSON.
             **/
	    	function convertXMLToJsonOlac (metadata) {
	    		var doc = x2js.xml_str2json(metadata),
					content = {};
				console.log(doc);
				if (angular.isDefined(doc.olac)) {
					for (var olacElementName in $scope.olacElementsObject) {
						if (angular.isDefined(doc.olac[olacElementName])) {
							content[olacElementName] = [];
							if (angular.isArray(doc.olac[olacElementName])) {
								for(var iElm=0 ; iElm<doc.olac[olacElementName].length ; iElm++) {
									content[olacElementName].push({
										type: doc.olac[olacElementName][iElm]['_xsi:type'],
										code: doc.olac[olacElementName][iElm]['_olac:code'],
										value: doc.olac[olacElementName][iElm].__text,
										lang: doc.olac[olacElementName][iElm]['_xml:lang']
									});
								}
							} else {
								content[olacElementName].push({
									type: doc.olac[olacElementName]['_xsi:type'],
									code: doc.olac[olacElementName]['_olac:code'],
									value: doc.olac[olacElementName].__text,
									lang: doc.olac[olacElementName]['_xml:lang']
								});
							}
						}
					}
				} else {
					console.log('XML parser error : root element not found or not a dc element');
				}
				return content;
	    	}

	    	function saveAndUpdateFailed(reason) {
	    		console.log('save and update failed');
				console.log(reason);
	    	}

        	function isChanged() {
        		for(var i=0;i<$scope.metadatas.length;i++) {
        			if ($scope.metadatas[i].changed	=== true) {
        				return true;
        			}
        		}
        		return false;
        	}

            /**
             *
             */
            function showSavingMetadataModal() {
                var savingMetadataModal,
                	modalScope = Helper.createModalScope(true);
                modalScope.save = function () {
                	// Paralell updateMetadataObject is not possible (Row was updated or deleted by another transaction)
                    var deferred = null;
                    angular.forEach($scope.metadatas, function (md) {
                    	if (md.changed === true) {
                    		var tmpDeferred = $q.defer();
                    		if (deferred === null) {
                    			saveAndUpdate(md, tmpDeferred);
                    		} else {
                    			deferred.then(function () { saveAndUpdate(md, tmpDeferred); }, saveAndUpdateFailed);
                    		}
			                deferred = tmpDeferred.promise;
                    	}
                    });
                    if (deferred !== null) {
	                    deferred.then(function () {
			           		savingMetadataModal.hide();
		                    $scope.$hide();
	                    }, saveAndUpdateFailed);
                    }
                };
                modalScope.exit = function () {
                    savingMetadataModal.hide();
                    // TODO Resets metadatas
                    $scope.forceHide = true;
                    $scope.$hide();
                };
                savingMetadataModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/save-metadata-modal.html',
                    show: true
                });
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

			$scope.metadataExist = function (name) {
				return findMetadata(name) !== null;
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
				var metadata = findMetadata(metadataFormat);
				if (metadata === null) {
					$scope.metadatas.push({name: metadataFormat,
						label: angular.isDefined($scope.metadataFormats[metadataFormat]) ? $scope.metadataFormats[metadataFormat].label : metadataFormat,
						changed: true});
					$scope.selectMetadataByName(metadataFormat);
				}
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
				// Creates/Updates in the server
				postForm(angular.toJson($scope.selectedMetadata.content), $scope.selectedMetadata.name).then(
       				function (metadataObject) {
       					var md = findMetadata(metadataObject.name);
       					if (md !== null) {
       						$scope.selectedMetadata.key = metadataObject.key;
       					}
       					md.changed = false;
       					// TODO Copy the metadata saved to origin array
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
               			$scope.selectMetadataByName($scope.selectedMetadata.name);
               			$scope.selectedMetadata.changed = true;
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
               			if ($scope.metadataFormats[$scope.selectedMetadata.name]) {
               				$scope.selectedMetadata.content = $scope.metadataFormats[$scope.selectedMetadata.name].converter(data.data);
               			} else {
               				//TODO alert
               				console.log('unable to convert metadata format ' + $scope.selectedMetadata.name);
               			}

               			$scope.selectMetadataByName($scope.selectedMetadata.name);
						$scope.selectedMetadata.changed = true;
			        }, function (reason) {
						//TODO show message to user
			        	console.log(reason);
			        });
                    $scope.fileToConvertSelectorModal.hide();
                }
            });

            $scope.$parent.$on('modal.hide.before', function ($event) {
                if (!$scope.forceHide && isChanged()) {
                    showSavingMetadataModal();
                    $event.preventDefault();
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

		        $scope.metadataFormats = {
		        	'oai_dc': {label: 'Dublin Core', template: 'metadata-editor/oai_dc/oai_dc-metadata-editor.html', converter: convertXMLToJsonOaiDc},
		        	'olac': {label: 'OLAC', template: 'metadata-editor/olac/olac-metadata-editor.html', converter: convertXMLToJsonOlac}
		        };

				$scope.dcElementsObject = {
					title: {label: 'Titre', placeholder: 'Titre'},
					creator: {label: 'Créateur', placeholder: 'Créateur'},
					subject: {label: 'Sujet', placeholder: 'Sujet'},
					description: {label: 'Description', placeholder: 'Description'},
					publisher: {label: 'Editeur', placeholder: 'Editeur'},
					contributor: {label: 'Contributeur', placeholder: 'Contributeur'},
					date: {label: 'Date', placeholder: 'Date'},
					type: {label: 'Type', placeholder: 'Type'},
					format: {label: 'Format', placeholder: 'Format'},
					identifier: {label: 'Identifiant', placeholder: 'Identifiant'},
					source: {label: 'Source', placeholder: 'Source'},
					language: {label: 'Langue', placeholder: 'Langue'},
					relation: {label: 'Relation', placeholder: 'Relation'},
					coverage: {label: 'Couverture', placeholder: 'Couverture'},
					rights: {label: 'Droits', placeholder: 'Droits'}
				};

				$scope.olacElementsObject = {
					title: {label: 'Titre', placeholder: 'Titre'},
					creator: {label: 'Créateur', placeholder: 'Créateur'},
					subject: {label: 'Sujet', placeholder: 'Sujet'},
					description: {label: 'Description', placeholder: 'Description'},
					publisher: {label: 'Editeur', placeholder: 'Editeur'},
					contributor: {label: 'Contributeur', placeholder: 'Contributeur'},
					date: {label: 'Date', placeholder: 'Date'},
					type: {label: 'Type', placeholder: 'Type'},
					format: {label: 'Format', placeholder: 'Format'},
					identifier: {label: 'Identifiant', placeholder: 'Identifiant'},
					source: {label: 'Source', placeholder: 'Source'},
					language: {label: 'Langue', placeholder: 'Langue'},
					relation: {label: 'Relation', placeholder: 'Relation'},
					coverage: {label: 'Couverture', placeholder: 'Couverture'},
					rights: {label: 'Droits', placeholder: 'Droits'},
					alternative: {label: 'Titre alternatif', placeholder: 'Titre alternatif'},
					tableOfContents: {label: 'Table des matières', placeholder: 'Table des matières'},
					abstract: {label: 'Résumé', placeholder: 'Résumé'},
					created: {label: 'Date de création', placeholder: 'Date de création'},
					valid: {label: 'Date de validation', placeholder: 'Date de validation'},
					available: {label: 'Date de validité', placeholder: 'Date de validité'},
					issued: {label: 'Date', placeholder: 'Date'},
					modified: {label: 'Date', placeholder: 'Date'},
					dateAccepted: {label: 'Date', placeholder: 'Date'},
					dateCopyrighted: {label: 'Date', placeholder: 'Date'},
					dateSubmitted: {label: 'Date', placeholder: 'Date'},
					extent: {label: 'Taille', placeholder: 'Taille'},
					medium: {label: 'Taille', placeholder: 'Taille'},
					isVersionOf: {label: 'Est la version de', placeholder: 'Est la version de'},
					hasVersion: {label: 'A la version', placeholder: 'A la version'},
					isReplacedBy: {label: 'Est remplacer par', placeholder: 'Est remplacer par'},
					replaces: {label: 'Remplace', placeholder: 'Remplace'},
					isRequiredBy: {label: 'Est nécessaire par', placeholder: 'Est nécessaire par'},
					requires: {label: 'Necessite', placeholder: 'Necessite'},
					isPartOf: {label: 'Fait parti de', placeholder: 'Fait parti de'},
					hasPart: {label: 'A pour partie', placeholder: 'A pour partie'},
					isReferencedBy: {label: 'Est réferencé par', placeholder: 'Est réferencé par'},
					references: {label: 'Fait référence à', placeholder: 'Fait référence à'},
					isFormatOf: {label: 'Est le format de', placeholder: 'Est le format de'},
					hasFormat: {label: 'A pour format', placeholder: 'A pour format'},
					conformsTo: {label: 'Est conforme à', placeholder: 'Est conforme à'},
					spatial: {label: 'Coordonnée spaciale', placeholder: 'Coordonnée spaciale'},
					temporal: {label: 'Coordonnée temporelle', placeholder: 'Coordonnée temporelle'},
					audience: {label: 'Audience', placeholder: 'Audience'},
					accrualMethod: {label: 'AccrualMethod', placeholder: 'AccrualMethod'},
					accrualPeriodicity: {label: 'AccrualPeriodicity', placeholder: 'AccrualPeriodicity'},
					accrualPolicy: {label: 'AccrualPolicy', placeholder: 'AccrualPolicy'},
					instructionalMethod: {label: 'InstructionalMethod', placeholder: 'InstructionalMethod'},
					provenance: {label: 'Provenance', placeholder: 'Provenance'},
					rightsHolder: {label: 'RightsHolder', placeholder: 'RightsHolder'},
					mediator: {label: 'Mediator', placeholder: 'Mediator'},
					educationLevel: {label: 'EducationLevel', placeholder: 'EducationLevel'},
					accessRights: {label: 'Droits d\'accès', placeholder: 'Droits d\'accès'},
					license: {label: 'Licence', placeholder: 'Licence'},
					bibliographicCitation: {label: 'Citation bibliographique', placeholder: 'Citation bibliographique'}
				};
                $scope.metadatas = angular.copy($scope.userMetadatas);
				angular.forEach($scope.metadatas, function (md) {
					md.label = angular.isDefined($scope.metadataFormats[md.name]) ? $scope.metadataFormats[md.name].label : md.name;
				});

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
