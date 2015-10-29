'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:AdditionalInfoCtrl
 * @description
 * # AdditionalInfoCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('AdditionalInfoCtrl', ['$rootScope', '$scope', '$modal', '$translate', 'Workspace',
        function ($rootScope, $scope, $modal, $translate, Workspace) {

            /**
             * Methods on publications
             **/

        	$scope.removePublication = function(publication) {
        		var index = $scope.metadata.publications.indexOf(publication);
	            if (index > -1) {
	                $scope.metadata.publications.splice(index, 1);
	            }
        	};

        	$scope.addPublication = function() {
        		if($scope.publication) {
        			$scope.metadata.publications.push({priority:'primary', value:$scope.publication});
        			$scope.publication = '';
        		}
        	};

			/**
             * Methods on priview
             **/

            $scope.removePath = function(path) {
        		var index = $scope.metadata.preview.paths.indexOf(path);
	            if (index > -1) {
	                $scope.metadata.preview.paths.splice(index, 1);
	            }
            };

            /**
             * Methods on keywords
             **/

        	$scope.removeKeyword = function(keyword) {
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
                console.log('additional-info caught event "browserSelectedElements-filePreviewPathSelectorModal" (selected elements: %o)', elements);

               if(elements.length>0) {
               		if(angular.isUndefined($scope.metadata.preview)) {
               			$scope.metadata.preview = {type: 'line', paths:[]};
               		}

                    if($scope.metadata.preview.paths.indexOf(elements[0].path) === -1){
                        $scope.metadata.preview.paths.push(elements[0].path);
                    }
                    $scope.filePreviewPathSelectorModal.hide();
                }
            });

            $scope.$on('$destroy', function () {
                deregisterFilePreviewPathSelectorModal();
            });

        	function init() {

                var filePreviewPathSelectorModalScope = $rootScope.$new();
                filePreviewPathSelectorModalScope.acceptMultiple = false;
                filePreviewPathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                filePreviewPathSelectorModalScope.forceHead = true;
                filePreviewPathSelectorModalScope.fileSelectId = 'filePreviewPathSelectorModal';
                $scope.filePreviewPathSelectorModal = $modal({scope: filePreviewPathSelectorModalScope, 
                	title: 'Sélectionnez un fichier pour l\'aperçu', 
                	template: 'common/directives/file-select-modal-template.html', 
                	show: false
                });

        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.keyword = {lang:'fr'};
        	}
        	init();
}]);