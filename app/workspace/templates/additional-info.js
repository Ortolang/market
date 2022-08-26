'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AdditionalInfoCtrl
 * @description
 * # AdditionalInfoCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AdditionalInfoCtrl', ['$rootScope', '$scope', '$modal', '$translate', 'Workspace', 'WorkspaceMetadataService', 'Helper',
        function ($rootScope, $scope, $modal, $translate, Workspace, WorkspaceMetadataService, Helper) {

            /**
             * Methods on publications
             **/

        	$scope.removePublication = function(publication) {
                if (!WorkspaceMetadataService.canEdit) {
                    return;
                }
        		var index = $scope.metadata.publications.indexOf(publication);
	            if (index > -1) {
	                $scope.metadata.publications.splice(index, 1);
                    if($scope.metadata.publications.length===0) {
                        delete $scope.metadata.publications;
                    }
	            }
        	};

        	$scope.addPublication = function() {
        		if($scope.publication) {
                    if($scope.metadata.publications===undefined) {
                        $scope.metadata.publications = [];
                    }
        			$scope.metadata.publications.push($scope.publication);
        			$scope.publication = '';
        		}
        	};

			/**
             * Methods on priview
             **/

            $scope.removePath = function(path) {
                if (!WorkspaceMetadataService.canEdit) {
                    return;
                }
        		var index = $scope.metadata.preview.indexOf(path);
	            if (index > -1) {
	                $scope.metadata.preview.splice(index, 1);
                    if($scope.metadata.preview.length===0) {
                        delete $scope.metadata.preview;
                    }
	            }
            };

            /**
             * Methods on keywords
             **/

        	$scope.removeKeyword = function(keyword) {
                if (!WorkspaceMetadataService.canEdit) {
                    return;
                }
        		var index = $scope.metadata.keywords.indexOf(keyword);
	            if (index > -1) {
	                $scope.metadata.keywords.splice(index, 1);
	            }
        	};

        	$scope.addKeyword = function() {
        		if($scope.keyword && $scope.keyword.value) {
        			if(angular.isUndefined($scope.metadata.keywords)) {
        				$scope.metadata.keywords = [];
        			}
        			$scope.metadata.keywords.push($scope.keyword);
        			$scope.keyword = {lang:'fr'};
        		}
        	};

            var deregisterFilePreviewPathSelectorModal = $rootScope.$on('browserSelectedElements-filePreviewPathSelectorModal', function ($event, elements) {
               if(elements.length>0) {
               		if(angular.isUndefined($scope.metadata.preview)) {
               			$scope.metadata.preview = [];
               		}

                    if($scope.metadata.preview.indexOf(elements[0].path) === -1){
                        $scope.metadata.preview.push(elements[0].path);
                    }
                    $scope.filePreviewPathSelectorModal.hide();
                }
            });

            var deregisterFileWebsitePathSelectorModal = $rootScope.$on('browserSelectedElements-fileWebsitePathSelectorModal', function ($event, elements) {
               if(elements.length>0) {
                    $scope.metadata.website = elements[0].path;
                    $scope.fileWebsitePathSelectorModal.hide();
                }
            });

            $scope.$on('$destroy', function () {
                deregisterFilePreviewPathSelectorModal();
                deregisterFileWebsitePathSelectorModal();
            });

        	function init() {
                $scope.WorkspaceMetadataService = WorkspaceMetadataService;

                var filePreviewPathSelectorModalScope = $rootScope.$new();
                filePreviewPathSelectorModalScope.acceptMultiple = false;
                filePreviewPathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                filePreviewPathSelectorModalScope.forceHead = true;
                filePreviewPathSelectorModalScope.fileSelectId = 'filePreviewPathSelectorModal';
                $scope.filePreviewPathSelectorModal = $modal({scope: filePreviewPathSelectorModalScope,
                	title: 'Sélectionnez un fichier pour l\'aperçu',
                	templateUrl: 'browser/browser-file-select-modal-template.html',
                	show: false
                });

        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.keyword = {lang:'fr'};

                var fileWebsitePathSelectorModalScope = $rootScope.$new();
                fileWebsitePathSelectorModalScope.acceptMultiple = false;
                fileWebsitePathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileWebsitePathSelectorModalScope.forceHead = true;
                fileWebsitePathSelectorModalScope.fileSelectId = 'fileWebsitePathSelectorModal';
                $scope.fileWebsitePathSelectorModal = $modal({scope: fileWebsitePathSelectorModalScope,
                    title: 'Sélectionnez un fichier',
                    templateUrl: 'browser/browser-file-select-modal-template.html',
                    show: false
                });

                $scope.websiteSources = [
                    {key:'external',value: $translate.instant('WORKSPACE.METADATA_EDITOR.EXTERNAL_WEBSITE')},
                    {key:'internal',value: $translate.instant('WORKSPACE.METADATA_EDITOR.INTERNAL_WEBSITE')}

                ];
                if(!Helper.startsWith($scope.metadata.website, 'http')) {
                    $scope.websiteSource = $scope.websiteSources[1].key;
                } else {
                    $scope.websiteSource = $scope.websiteSources[0].key;
                }
        	}
        	init();
}]);
