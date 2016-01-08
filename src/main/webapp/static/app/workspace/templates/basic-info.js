'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BasicInfoCtrl
 * @description
 * # BasicInfoCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BasicInfoCtrl', ['$rootScope', '$scope', '$filter', '$translate', '$modal', 'Workspace',
        function ($rootScope, $scope, $filter, $translate, $modal, Workspace) {

        	//TODO put this method to a service
            function findObjectOfArray(arr, propertyName, propertyValue, defaultValue) {
                if(arr) {
                    var iObject;
                    for (iObject = 0; iObject < arr.length; iObject++) {
                        if (arr[iObject][propertyName] === propertyValue) {
                            return arr[iObject];
                        }
                    }
                }
                if(defaultValue) {
                    return defaultValue;
                }
                return null;
            }

            $scope.changeTitleLanguage = function () {
            	var title = findObjectOfArray($scope.metadata.title, 'lang', $scope.selectedTitleLanguage);
            	if(title!==null) {
                	$scope.title = title;
            	} else {
            		title = {lang:$scope.selectedTitleLanguage, value:''};
                	$scope.title = title;
            	}
            };

            $scope.changeDescriptionLanguage = function () {
            	var description = findObjectOfArray($scope.metadata.description, 'lang', $scope.selectedDescriptionLanguage);
            	if(description!==null) {
                	$scope.description = description;
            	} else {
            		description = {lang:$scope.selectedDescriptionLanguage, value:''};
                	$scope.description = description;
            	}
            };

            $scope.updateTitle = function() {
                if($scope.title.value!=='') {
                    var title = findObjectOfArray($scope.metadata.title, 'lang', $scope.selectedTitleLanguage);
                    if(title===null) {
                        title = {lang:$scope.selectedTitleLanguage, value:$scope.title.value};
                        if(angular.isUndefined($scope.metadata.title)) {
                            $scope.metadata.title = [];
                        }
                        $scope.metadata.title.push(title);
                    } else {
                        title.value = $scope.title.value;
                    }
                }
            };

            $scope.updateDescription = function() {
                if($scope.description.value!=='') {
                    var description = findObjectOfArray($scope.metadata.description, 'lang', $scope.selectedDescriptionLanguage);
                    if(description===null) {
                        description = {lang:$scope.selectedDescriptionLanguage, value:$scope.description.value};
                        if(angular.isUndefined($scope.metadata.description)) {
                            $scope.metadata.description = [];
                        }
                        $scope.metadata.description.push(description);
                    } else {
                        description.value = $scope.description.value;
                    }
                }
            };

            /**
             * Methods on documentations
             **/

            $scope.removeDocumentation = function(documentation) {
                var index = $scope.metadata.relations.indexOf(documentation);
                var indexDoc = $scope.documentations.indexOf(documentation);
                if (index > -1) {
                    $scope.metadata.relations.splice(index, 1);
                    if($scope.metadata.relations.length===0) {
                        delete $scope.metadata.relations;
                    }
                    
                    $scope.documentations.splice(indexDoc, 1);
                }
            };

            var deregisterFileDocumentationPathSelectorModal = $rootScope.$on('browserSelectedElements-fileDocumentationPathSelectorModal', function ($event, elements) {
            
               if(elements.length>0) {
                    if(angular.isUndefined($scope.metadata.relations)) {
                        $scope.metadata.relations = [];
                    }

                    var relationDocumentation = {type:'documentation', label:[{lang:'fr', value:'Lire la documentation'},{lang:'en', value:'Read the documentation'}], path: elements[0].path};
                    
                    var matchedReleations = $filter('filter')($scope.metadata.relations, {path: relationDocumentation.path}, true);
                    if(matchedReleations.length===0) {
                        $scope.metadata.relations.push(relationDocumentation);
                        $scope.documentations.push(relationDocumentation);
                    }

                    $scope.fileDocumentationPathSelectorModal.hide();
                }
            });

            $scope.$on('$destroy', function () {
                deregisterFileDocumentationPathSelectorModal();
            });

        	function init() {
        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.type = $scope.metadata.type;
                $scope.button = {type: $scope.metadata.type};
                
                $scope.selectedTitleLanguage = 'fr';
                $scope.title = {value: ''};
                if($scope.metadata.title) {
                    $scope.changeTitleLanguage($scope.selectedTitleLanguage);
                }

                $scope.selectedDescriptionLanguage = 'fr';
                $scope.description = {value: ''};
                if($scope.metadata.description) {
                    $scope.changeDescriptionLanguage($scope.selectedDescriptionLanguage);
                }

                $scope.documentations = [];
                if($scope.metadata.relations) {
                    angular.forEach($scope.metadata.relations, function(relation) {
                        if(relation.type === 'documentation') {
                            $scope.documentations.push(relation);
                        }
                    });
                }

                var fileDocumentationPathSelectorModalScope = $rootScope.$new();
                fileDocumentationPathSelectorModalScope.acceptMultiple = false;
                fileDocumentationPathSelectorModalScope.forceWorkspace = Workspace.active.workspace.key;
                fileDocumentationPathSelectorModalScope.forceHead = true;
                fileDocumentationPathSelectorModalScope.fileSelectId = 'fileDocumentationPathSelectorModal';
                $scope.fileDocumentationPathSelectorModal = $modal({scope: fileDocumentationPathSelectorModalScope, 
                    title: 'Sélectionnez un fichier contenant la documentation',
                    template: 'common/directives/file-select-modal-template.html', 
                    show: false
                });

        	}
        	init();
}]);