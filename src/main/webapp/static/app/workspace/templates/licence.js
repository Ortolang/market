'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LicenceCtrl
 * @description
 * # LicenceCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LicenceCtrl', ['$rootScope', '$scope', '$filter', '$modal', '$translate', 'Settings', 'ReferentialEntityResource', 'Helper',
        function ($rootScope, $scope, $filter, $modal, $translate, Settings, ReferentialEntityResource, Helper) {


            /**
             * Methods on person
             **/

            function prepareModalScopeNewLicence() {
                var modalScope = $rootScope.$new(true);
                modalScope.type = 'Licence';
                modalScope.allStatusOfUse = $scope.allStatusOfUse;

                modalScope.languages = $scope.languages;

                return modalScope;
            }

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

            $scope.addLicence = function () {

                var modalScope = prepareModalScopeNewLicence(),
                    addLicenceModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });


                modalScope.updateDescription = function() {
                    if(modalScope.descriptionSelected.value!=='') {
                        var description = findObjectOfArray(modalScope.description, 'lang', $scope.selectedDescriptionLanguage);
                        if(description===null) {
                            description = {lang:$scope.selectedDescriptionLanguage, value:modalScope.descriptionSelected.value};
                            if(angular.isUndefined(modalScope.description)) {
                                modalScope.description = [];
                            }
                            modalScope.description.push(description);
                        } else {
                            description.value = modalScope.descriptionSelected.value;
                        }
                    }
                };

                modalScope.submit = function (addLicenceForm) {

                    if (addLicenceForm.$valid) {
                        if($scope.metadata.license===undefined) {
                            $scope.metadata.license = {};
                        }

                        $scope.metadata.license.label = modalScope.label;
                    	$scope.metadata.license.status = modalScope.status;
                        if(modalScope.description) {
                            $scope.metadata.license.description = angular.copy(modalScope.description);
                        }
                        if(modalScope.licenseWebsite) {
                            $scope.metadata.license.text = {lang:'fr', value:{url: modalScope.licenseWebsite}};
                        }
                    	// $scope.metadata.license.licenseWebsite = modalScope.licenseWebsite;

                        $scope.metadata.statusOfUse = modalScope.status;

                        addLicenceModal.hide();
                    }
                };

                addLicenceModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-licence-modal.html'
                });
            };

            $scope.changeConditionsOfUseLanguage = function () {
                var conditionsOfUse = findObjectOfArray($scope.metadata.conditionsOfUse, 'lang', $scope.selectedConditionsOfUseLanguage);
                if(conditionsOfUse!==null) {
                    $scope.conditionsOfUse = conditionsOfUse;
                } else {
                    conditionsOfUse = {lang:$scope.selectedConditionsOfUseLanguage, value:''};
                    $scope.conditionsOfUse = conditionsOfUse;
                }
            };

            $scope.updateConditionsOfUse = function() {
                if($scope.conditionsOfUse.value!=='') {
                    var conditionsOfUse = findObjectOfArray($scope.metadata.conditionsOfUse, 'lang', $scope.selectedConditionsOfUseLanguage);
                    if(conditionsOfUse===null) {
                        conditionsOfUse = {lang:$scope.selectedConditionsOfUseLanguage, value:$scope.conditionsOfUse.value};
                        if(angular.isUndefined($scope.metadata.conditionsOfUse)) {
                            $scope.metadata.conditionsOfUse = [];
                        }
                        $scope.metadata.conditionsOfUse.push(conditionsOfUse);
                    } else {
                        conditionsOfUse.value = $scope.conditionsOfUse.value;
                    }
                }
            };

            function loadAllStatusOfUse() {

                ReferentialEntityResource.get({type: 'STATUSOFUSE'}, function(entities) {
                    $scope.allStatusOfUse = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);
                        var label = Helper.getMultilingualValue(content.labels);

                        $scope.allStatusOfUse.push({id: '${'+entry.key+'}', label: label});
                    });

                    // Init with default value if not already set
                    if(!$scope.metadata.statusOfUse) {
                        $scope.metadata.statusOfUse = '${referential:free_use}';
                    }
                });
            }

            function loadAllLicense() {

                ReferentialEntityResource.get({type: 'LICENSE'}, function(entities) {
                    $scope.allLicences = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);

                        $scope.allLicences.push({id: '${'+entry.key+'}', label: content.label});
                    });
                });
            }

        	function init() {
                $scope.languages = [
                    {key:'fr',value: $translate.instant('LANGUAGES.FR')},
                    {key:'en', value: $translate.instant('LANGUAGES.EN')},
                    {key:'es', value: $translate.instant('LANGUAGES.ES')},
                    {key:'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];

        		loadAllStatusOfUse();
                loadAllLicense();

                $scope.selectedConditionsOfUseLanguage = 'fr';
                $scope.conditionsOfUse = {value: ''};
                if($scope.metadata.conditionsOfUse) {
                    $scope.changeConditionsOfUseLanguage($scope.selectedConditionsOfUseLanguage);
                }
        	}
        	init();
}]);
