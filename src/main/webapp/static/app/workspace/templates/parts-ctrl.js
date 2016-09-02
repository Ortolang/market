'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:PartsCtrl
 * @description
 * # PartsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('PartsCtrl', ['$scope', '$modal', 'WorkspaceMetadataService', 'Helper',
        function ($scope, $modal, WorkspaceMetadataService, Helper) {

	    	$scope.createPart = function (part) {
	    		if (WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true),
                	createPartModal,
                    updateMode = angular.isDefined(part),
                    indexPart = $scope.parts.indexOf(part);
                if (part) {
                    modalScope.part = part;
                } else {
                    modalScope.part = {
                        title: [],
                        description: []
                    };
                }

	            modalScope.submit = function (createPartForm) {
                    if (createPartForm.$valid) {
                        if (updateMode) {
                            WorkspaceMetadataService.updatePart(
                                indexPart,
                                modalScope.part.title,
                                modalScope.part.description
                            );

                        } else {
                            WorkspaceMetadataService.addPart(
                                modalScope.part.title,
                                modalScope.part.description
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
	    	    if ($scope.metadata.parts) {
                    $scope.parts = angular.copy($scope.metadata.parts);
                } else {
                    $scope.parts = {
                        title: [],
                        description: []
                    };
                }
	    	}
	    	init();
}]);