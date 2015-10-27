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


        	//TODO put this 2 methods to a service
            function getValues(arr, propertyName, propertyValue) {
                var values = [];
                if (arr) {
                    var iObject;
                    for (iObject = 0; iObject < arr.length; iObject++) {
                        if (arr[iObject][propertyName] === propertyValue) {
                            values.push(arr[iObject].value);
                        }
                    }
                }
                return values;
            }
            function getValue(arr, propertyName, propertyValue, defaultValue) {
                var values = getValues(arr, propertyName, propertyValue);
                if (arr && values.length === 0) {
                    return defaultValue;
                }
                return values[0];
            }

            $scope.changeLanguage = function (lang) {
            	$scope.title.lang = lang;
                $scope.title.value = getValue(Workspace.active.metadata.title, 'lang', lang, '');
            };

        	function init() {
        		$scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.title = {};
                $scope.changeLanguage(Settings.language);
        	}
        	init();
}]);