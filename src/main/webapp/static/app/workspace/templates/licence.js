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
             * Updates the license property.
             **/
            $scope.updateLicense = function(license) {
                $scope.metadata.license = license.id;
                $scope.selectedLicense = license;
                $scope.updateStatusOfUse(license.id);
            };

            /**
             * Updates the status of use.
             **/
            $scope.updateStatusOfUse = function(license) {
                var statusOfLicense = $filter('filter')($scope.allLicences, {id: license}, true);
                if(statusOfLicense.length>0) {
                    $scope.metadata.statusOfUse = statusOfLicense[0].status;
                }
            };

            /**
             * Deletes the licence.
             **/
            $scope.deleteLicense = function () {
                delete $scope.metadata.license;
                delete $scope.selectedLicense;
            }

            /**
             * Edit the licence.
             **/
            $scope.editLicense = function (license) {
                if (license.id) {
                    $scope.chooseLicence(license);
                } else {
                    $scope.addLicence(license);
                }
            };

            /**
             * All methods on license modal for choosing a licence
             **/

            function prepareModalScopeChooseLicence(license) {
                var modalScope = $rootScope.$new(true);
                modalScope.allLicences = $scope.allLicences;
                modalScope.model = {};

                return modalScope;
            }

            $scope.chooseLicence = function (license) {
                var modalScope = prepareModalScopeChooseLicence(license),
                    chooseLicenceModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });
                modalScope.chooseLicense = function(license) {
                    $scope.updateLicense(license);
                    chooseLicenceModal.hide();
                };
                chooseLicenceModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/choose-licence-modal.html'
                });
            };

             /**** End of model license **/

            /**
             * All methods on license modal for creating a new licence
             **/

            function prepareModalScopeNewLicence(license) {
                var modalScope = $rootScope.$new(true);

                modalScope.model = {};
                modalScope.model.selectedDescriptionLanguage = 'fr';
                if (license) {
                    modalScope.editing = true;
                    modalScope.model.label = angular.copy(license.label);
                    var status = $filter('filter')($scope.allStatusOfUse, {id: license.status}, true);
                    if (status.length>0) {
                        modalScope.model.status = status[0];
                    }
                    if (license.description) {
                        modalScope.model.description = angular.copy(license.description);
                        var description = $filter('filter')(modalScope.model.description, {lang: modalScope.model.selectedDescriptionLanguage}, true);
                        if (description.length>0) {
                            modalScope.model.selectedDescription = description[0];
                        } else if (modalScope.model.description.length>0) {
                            modalScope.model.selectedDescription = modalScope.model.description[0];
                        }
                    } else {
                        modalScope.model.selectedDescription = {value: ''};    
                    }
                    modalScope.model.text = angular.copy(license.text);
                    if (modalScope.model.text) {
                        angular.forEach(modalScope.model.text, function (text) {
                            if(text.lang === 'fr' && angular.isDefined(text.value.url)) {
                                modalScope.model.licenseWebsite = text.value.url;
                            }
                        });
                    }
                } else {
                    modalScope.editing = false;
                    modalScope.model.selectedDescription = {value: ''};

                    var free_status = $filter('filter')($scope.allStatusOfUse, {id: '${referential:free_use}'}, true);
                    if (free_status.length>0) {
                        modalScope.model.status = free_status[0];
                    }
                    modalScope.model.licenseWebsite = '';
                }

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

            $scope.addLicence = function (license) {

                var modalScope = prepareModalScopeNewLicence(license),
                    addLicenceModal;

                modalScope.$on('modal.hide', function () {
                    modalScope.$destroy();
                });

                modalScope.changeDescriptionLanguage = function () {
                    var description = findObjectOfArray(modalScope.model.description, 'lang', modalScope.model.selectedDescriptionLanguage);
                    if (description !== null) {
                        modalScope.model.selectedDescription = description;
                    } else {
                        description = {lang: modalScope.model.selectedDescriptionLanguage, value: ''};
                        modalScope.model.selectedDescription = description;
                    }
                }

                modalScope.updateDescription = function() {
                    if (modalScope.model.selectedDescription.value !== '') {
                        var description = findObjectOfArray(modalScope.model.description, 'lang', modalScope.model.selectedDescriptionLanguage);
                        if (description === null) {
                            description = {
                                lang: modalScope.model.selectedDescriptionLanguage,
                                value: modalScope.model.selectedDescription.value
                            };
                            if (angular.isUndefined(modalScope.model.description)) {
                                modalScope.model.description = [];
                            }
                            modalScope.model.description.push(description);
                        } else {
                            description.value = modalScope.model.selectedDescription.value;
                        }
                    }
                };

                modalScope.submit = function (addLicenceForm) {

                    if (addLicenceForm.$valid) {
                        if($scope.metadata.license===undefined) {
                            $scope.metadata.license = {};
                        }

                        $scope.metadata.license.label = modalScope.model.label;
                    	$scope.metadata.license.status = modalScope.model.status.id;
                        if(modalScope.model.description) {
                            $scope.metadata.license.description = angular.copy(modalScope.model.description);
                        }
                        if(modalScope.model.licenseWebsite) {
                            if ($scope.metadata.license.text) {
                                var licenseTextFr = $filter('filter')($scope.metadata.license.text, {lang: 'fr'}, true);
                                if (licenseTextFr.length>0) {
                                    licenseTextFr[0].value = {url: modalScope.model.licenseWebsite};
                                }
                            } else {
                                $scope.metadata.license.text = [{lang:'fr', value:{url: modalScope.model.licenseWebsite}}];
                            }
                        }

                        $scope.selectedLicense = $scope.metadata.license;
                        // Override status of use
                        $scope.metadata.statusOfUse = modalScope.model.status.id;

                        addLicenceModal.hide();
                    }
                };

                addLicenceModal = $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-licence-modal.html'
                });
            };

            /** End of new license modal **/

            /**
             * Sets the language applies to conditions of use property.
             **/
            $scope.changeConditionsOfUseLanguage = function () {
                var conditionsOfUse = findObjectOfArray($scope.metadata.conditionsOfUse, 'lang', $scope.selectedConditionsOfUseLanguage);
                if(conditionsOfUse!==null) {
                    $scope.conditionsOfUse = conditionsOfUse;
                } else {
                    conditionsOfUse = {lang:$scope.selectedConditionsOfUseLanguage, value:''};
                    $scope.conditionsOfUse = conditionsOfUse;
                }
            };

            /**
             * Updates conditions of use property.
             **/
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

            /**
             * Loads all status of use value.
             **/
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

            /**
             * Loads all license.
             **/
            function loadAllLicense() {
                ReferentialEntityResource.get({type: 'LICENSE'}, function(entities) {
                    $scope.allLicences = [];
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);
                        var id = Helper.createKeyFromReferentialId(entry.key);
                        var license = {
                            id: id, 
                            label: content.label, 
                            status: content.status,
                            description: content.description ? Helper.getMultilingualValue(content.description) : undefined
                        };
                        $scope.allLicences.push(license);

                        if ($scope.metadata.license && $scope.metadata.license === id) {
                            $scope.selectedLicense = license;
                        }
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

                if (angular.isObject($scope.metadata.license)) {
                    $scope.selectedLicense = $scope.metadata.license;
                }

                $scope.selectedConditionsOfUseLanguage = 'fr';
                $scope.conditionsOfUse = {value: ''};
                if($scope.metadata.conditionsOfUse) {
                    $scope.changeConditionsOfUseLanguage($scope.selectedConditionsOfUseLanguage);
                }
        	}
        	init();
}]);
