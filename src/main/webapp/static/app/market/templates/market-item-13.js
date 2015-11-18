'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItem13Ctrl
 * @description
 * # MarketItem13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItem13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content',
        function ($scope, $rootScope, $translate, Settings, Content) {


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
        		if($scope.content.license !== undefined && $scope.content.license.description) {
        			$scope.licenseDescription = getValue($scope.content.license.description, 'lang', lang);
        		}

        		// $scope.licenseDescription = $scope.content.license.description[0].value;
        		if($scope.content.license !== undefined && $scope.content.license.text) {
        			// $scope.licenseURL = $scope.content.license.text[0].value.url;
        			$scope.licenseText = getValue($scope.content.license.text, 'lang', lang);
        		}
        	}

            function loadConditionsOfUse(lang) {
                if($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    $scope.conditionsOfUse = getValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }

            function loadRelation(relation, lang) {
                var url = null;
                if(relation.type==='hasPart') {
                    url = relation.path;
                } else {
                    url = Content.getContentUrlWithPath(relation.path, $scope.alias, $scope.root);
                    if (startsWith(relation.url, 'http')) {
                        url = relation.url;
                    }
                }
                
                return {
                        label: getValue(relation.label, 'lang', lang, 'unknown'),
                        type: relation.type,
                        url: url,
                        extension: relation.path.split('.').pop()
                    };
            }

            function loadRelations() {
                if($scope.content.relations) {
                    angular.forEach($scope.content.relations, function(relation) {
                        if(relation.type === 'documentation') {
                            $scope.documentations.push(loadRelation(relation));
                        }
                    });
                }
            }

            function startsWith (actual, expected) {
                var lowerStr = (actual + '').toLowerCase();
                return lowerStr.indexOf(expected.toLowerCase()) === 0;
            }


            $rootScope.$on('$translateChangeSuccess', function () {
                loadLicense($translate.use());
                loadConditionsOfUse($translate.use());
            });

        	function init() {
                $scope.documentations = [];

                loadLicense(Settings.language);
                loadConditionsOfUse(Settings.language);
                loadRelations();

        	}
			init();
}]);