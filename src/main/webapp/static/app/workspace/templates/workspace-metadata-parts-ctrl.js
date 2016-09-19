'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceMetadataPartsCtrl
 * @description
 * # WorkspaceMetadataPartsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceMetadataPartsCtrl', ['$scope', '$rootScope', '$modal', 'WorkspaceMetadataService', 'Workspace', 'Helper',
        function ($scope, $rootScope, $modal, WorkspaceMetadataService, Workspace, Helper) {

	    	$scope.createPart = function (part) {
	    		if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                	createPartModal,
                    updateMode = angular.isDefined(part);
                if (part) {
                    modalScope.part = part;
                } else {
                    modalScope.part = {
                        title: [],
                        description: [],
                        path: '',
                        contributors: []
                    };
                }
                modalScope.metadata = $scope.metadata;

                var deregisterFilePreviewPathSelectorModal = $rootScope.$on('browserSelectedElements-dirPartPathSelectorModal', function ($event, elements) {
                    if(elements.length>0) {
                        modalScope.part.path = elements[0].path;
                        modalScope.dirPartPathSelectorModal.hide();
                    }
                });

                var dirPartPathSelectorModalScope = $rootScope.$new();
                dirPartPathSelectorModalScope.acceptMultiple = false;
                dirPartPathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                dirPartPathSelectorModalScope.forceHead = true;
                dirPartPathSelectorModalScope.fileSelectId = 'dirPartPathSelectorModal';
                modalScope.dirPartPathSelectorModal = $modal({scope: dirPartPathSelectorModalScope,
                    title: 'Sélectionnez un répertoire',
                    templateUrl: 'common/directives/file-select-modal-template.html',
                    show: false
                });

                var deregisterFileImageSelectorModal = $rootScope.$on('browserSelectedElements-dirPartImageSelectorModal', function ($event, elements) {
                    if(elements.length>0) {
                        modalScope.part.image = elements[0].path;
                        modalScope.filePartImageSelectorModal.hide();
                    }
                });

                var filePartImageSelectorModalScope = $rootScope.$new();
                filePartImageSelectorModalScope.acceptMultiple = false;
                filePartImageSelectorModalScope.forceMimeTypes = ['ortolang/collection', 'image'];
                filePartImageSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                filePartImageSelectorModalScope.forceHead = true;
                filePartImageSelectorModalScope.fileSelectId = 'dirPartImageSelectorModal';
                modalScope.filePartImageSelectorModal = $modal({scope: filePartImageSelectorModalScope,
                    title: 'Sélectionnez une image',
                    templateUrl: 'common/directives/file-select-modal-template.html',
                    show: false
                });

                modalScope.$on('$destroy', function () {
                    deregisterFilePreviewPathSelectorModal();
                    deregisterFileImageSelectorModal();
                });

                modalScope.submit = function (createPartForm) {
                    if (createPartForm.$valid) {
                        if (updateMode) {
                            WorkspaceMetadataService.updatePart(
                                $scope.parts.indexOf(part),
                                modalScope.part.title,
                                modalScope.part.description,
                                modalScope.part.path,
                                modalScope.part.image,
                                modalScope.part.contributors
                            );

                        } else {
                            WorkspaceMetadataService.addPart(
                                modalScope.part.title,
                                modalScope.part.description,
                                modalScope.part.path,
                                modalScope.part.image,
                                modalScope.part.contributors
                            );
                        }
		    			createPartModal.hide();
                    }
	            };
                createPartModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/create-part-modal.html',
                    show: true
                });
	    	};

            $scope.deletePart = function (index) {
                WorkspaceMetadataService.deletePart(index);
            };

            function loadParts () {
                $scope.parts = angular.copy($scope.metadata.parts);
            }

            $scope.$watchCollection('metadata.parts', function (newValue) {
                if (newValue) {
                    loadParts(newValue);
                }
            });

	    	function init() {
	    	    $scope.WorkspaceMetadataService = WorkspaceMetadataService;
	    	    if ($scope.metadata.parts) {
                    $scope.parts = angular.copy($scope.metadata.parts);
                } else {
                    $scope.parts = [];
                }
	    	}
	    	init();
}]);
