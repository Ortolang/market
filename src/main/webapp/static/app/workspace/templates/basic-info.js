'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:BasicInfoCtrl
 * @description
 * # BasicInfoCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('BasicInfoCtrl', ['$scope', '$translate', '$filter', 'Workspace', 'Settings',
        function ($scope, $translate, $filter, Workspace, Settings) {

        	//TODO put this method to a service
            function findObjectOfArray(arr, propertyName, propertyValue, defaultValue) {
                var iObject;
                for (iObject = 0; iObject < arr.length; iObject++) {
                    if (arr[iObject][propertyName] === propertyValue) {
                        return arr[iObject];
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
            		$scope.metadata.title.push(title);
                	$scope.title = title;
            	}
            };

            $scope.changeDescriptionLanguage = function () {
            	var description = findObjectOfArray($scope.metadata.description, 'lang', $scope.selectedDescriptionLanguage);
            	if(description!==null) {
                	$scope.description = description;
            	} else {
            		description = {lang:$scope.selectedDescriptionLanguage, value:''};
            		$scope.metadata.description.push(description);
                	$scope.description = description;
            	}
                // $scope.description = findObjectOfArray($scope.metadata.description, 'lang', lang, '');
            };

        	function init() {
        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.type = $scope.metadata.type;
                $scope.selectedTitleLanguage = 'fr';
                $scope.changeTitleLanguage(Settings.language);
                $scope.selectedDescriptionLanguage = 'fr';
                $scope.changeDescriptionLanguage(Settings.language);
        	}
        	init();
}]);