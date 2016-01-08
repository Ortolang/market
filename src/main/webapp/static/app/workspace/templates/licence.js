'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:LicenceCtrl
 * @description
 * # LicenceCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('LicenceCtrl', ['$rootScope', '$scope', '$filter', '$modal', '$translate', 'Settings', 'QueryBuilderFactory', 'SearchResource',
        function ($rootScope, $scope, $filter, $modal, $translate, Settings, QueryBuilderFactory, SearchResource) {


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

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key',
                    source: 'statusofuse'
                });

                queryBuilder.addProjection('meta_ortolang-referentiel-json.id', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.labels[lang='+Settings.language+'].value', 'label');

                // queryBuilder.equals('meta_ortolang-referentiel-json.type', 'StatusOfUse');

                var query = queryBuilder.toString();
                $scope.allStatusOfUse = [];
                SearchResource.json({query: query}).$promise.then(function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var term = angular.fromJson(result);

                        $scope.allStatusOfUse.push({id: '${'+term.key+'}', label: term.label});

                        if(!$scope.metadata.statusOfUse && term.id === 'free_use') {
                            $scope.metadata.statusOfUse = '${'+term.key+'}';
                        }
                    });
                });
            }

            function loadAllLicense() {

                var queryBuilder = QueryBuilderFactory.make({
                    projection: 'key',
                    source: 'license'
                });

                // queryBuilder.addProjection('@rid', 'id');
                queryBuilder.addProjection('meta_ortolang-referentiel-json.label', 'label');

                // queryBuilder.equals('meta_ortolang-referentiel-json.type', 'License');

                var query = queryBuilder.toString();
                $scope.allLicences = [];
                SearchResource.json({query: query}).$promise.then(function (jsonResults) {
                    angular.forEach(jsonResults, function (result) {
                        var license = angular.fromJson(result);

                        $scope.allLicences.push({id: '${'+license.key+'}', label: license.label});
                        // var queryLicenseMeta = 'select from ' + license['meta_ortolang-referentiel-json'];
                        // SearchResource.json({query: queryLicenseMeta}, function (jsonObject) {
                        //     var licenseObject = angular.fromJson(jsonObject[0]);

                        //     cleanJsonDocument(licenseObject);

                        //     $scope.allLicences.push({
                        //         license: licenseObject,
                        //         label: licenseObject.label
                        //     });
                        // });
                    });
                });
            }

            function cleanJsonDocument(doc) {
                for (var propertyName in doc) {
                    if(propertyName.substring(0,1)==='@') {
                        delete doc[propertyName];
                    }
                }
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
