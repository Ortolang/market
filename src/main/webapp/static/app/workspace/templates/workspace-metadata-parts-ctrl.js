'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:WorkspaceMetadataPartsCtrl
 * @description
 * # WorkspaceMetadataPartsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('WorkspaceMetadataPartsCtrl', ['$scope', '$rootScope', '$modal', 'WorkspaceMetadataService', 'Workspace', 'Helper', 'ReferentialResource', '$q',
        function ($scope, $rootScope, $modal, WorkspaceMetadataService, Workspace, Helper, ReferentialResource, $q) {

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

                modalScope.submit = function (createPartForm) {
                    if (createPartForm.$valid) {
                        if (updateMode) {
                            WorkspaceMetadataService.updatePart(
                                $scope.parts.indexOf(part),
                                modalScope.part.title,
                                modalScope.part.description,
                                modalScope.part.path,
                                modalScope.part.contributors
                            );

                        } else {
                            WorkspaceMetadataService.addPart(
                                modalScope.part.title,
                                modalScope.part.description,
                                modalScope.part.path,
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