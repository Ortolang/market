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

            $scope.changeTitleLanguage = function (lang) {
                $scope.title = findObjectOfArray(Workspace.active.metadata.title, 'lang', lang);
            };

            $scope.changeDescriptionLanguage = function (lang) {
                $scope.description = findObjectOfArray(Workspace.active.metadata.description, 'lang', lang);
            };

        	function init() {
        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.changeTitleLanguage(Settings.language);
                $scope.changeDescriptionLanguage(Settings.language);
        	}
        	init();
}]);