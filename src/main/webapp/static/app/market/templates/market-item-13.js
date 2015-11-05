'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItem13Ctrl
 * @description
 * # MarketItem13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItem13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings',
        function ($scope, $rootScope, $translate, Settings) {


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
                    return arr.length > 0 ? arr[0].value : defaultValue;
                }
                return values[0];
            }

        	function loadLicense(lang) {
        		if($scope.content.license.description) {
        			$scope.licenseDescription = getValue($scope.content.license.description, 'lang', lang);
        		}

        		// $scope.licenseDescription = $scope.content.license.description[0].value;
        		if($scope.content.license.text) {
        			// $scope.licenseURL = $scope.content.license.text[0].value.url;
        			$scope.licenseText = getValue($scope.content.license.text, 'lang', lang);
        		}
        	}

            function loadConditionsOfUse(lang) {
                if($scope.content.conditionsOfUse) {
                    $scope.conditionsOfUse = getValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }


            $rootScope.$on('$translateChangeSuccess', function () {
                loadLicense($translate.use());
                loadConditionsOfUse($translate.use());
            });

        	function init() {

                if ($scope.content.license !== undefined && $scope.content.license !== '') {
                    loadLicense(Settings.language);
                }
                if ($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    loadConditionsOfUse(Settings.language);
                }

        	}
			init();
}]);