'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SpecificFieldsCtrl
 * @description
 * # SpecificFieldsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SpecificFieldsCtrl', ['$rootScope', '$scope', '$filter', '$translate', 'Settings', 'Helper', '$q', 'ReferentialEntityResource', 'WorkspaceMetadataService',
        function ($rootScope, $scope, $filter, $translate, Settings, Helper, $q, ReferentialEntityResource, WorkspaceMetadataService) {

            $scope.suggestLanguages = function (term) {
                if(term.length<2) {
                    return [];
                }
                var lang = Settings.language;
                var deferred = $q.defer();
                // allLanguages : {id: XX, label: YY}
                ReferentialEntityResource.get({type: 'LANGUAGE', lang:lang.toUpperCase(),term: term}, function(results) {
                    var suggestedLanguages = [];
                    angular.forEach(results.entries, function(refentity) {
                        var content = angular.fromJson(refentity.content);
                        var text = Helper.getMultilingualValue(content.labels);
                        if(text) {
                            suggestedLanguages.push({id: Helper.createKeyFromReferentialId(refentity.key), label: text});
                        }
                    });
                    deferred.resolve(suggestedLanguages);
                }, function (reason) {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.addLanguage = function(name, tag) {
                if(angular.isUndefined($scope.metadata[name])) {
                    $scope.metadata[name] = [];
                }
                if(angular.isDefined(tag.id)) {
                   $scope.metadata[name].push(tag.id);
                } else {
                    $scope.metadata[name].push(tag.label);
                }
            };

            $scope.removeLanguage = function(name, tag) {
                var value = tag.id ? tag.id : tag.label;
                var index = $scope.metadata[name].indexOf(value);
                if (index > -1) {
                    $scope.metadata[name].splice(index, 1);
                }
            };

            function loadLanguage(name) {
                // Array of the selected language
                $scope[name] = [];
                if(angular.isDefined($scope.metadata[name])) {
                    angular.forEach($scope.metadata[name], function(lang) {
                        ReferentialEntityResource.get({name:Helper.extractNameFromReferentialId(lang)}, function (entity) {
                            var content = angular.fromJson(entity.content);
                            $scope[name].push({id: Helper.createKeyFromReferentialId(entity.key), label: Helper.getMultilingualValue(content.labels)});
                        },
                        function () {
                            $scope[name].push({id:lang,label:lang});
                        });
                    });
                }
            }

            function addTerms(compatibility, arrayName) {

                $scope[arrayName] = [];

                ReferentialEntityResource.get({type: compatibility.toUpperCase()}, function(entities) {
                    angular.forEach(entities.entries, function(entry) {
                        var content = angular.fromJson(entry.content);

                        var entity = {id: Helper.createKeyFromReferentialId(entry.key), label: Helper.getMultilingualValue(content.labels)};
                        if(content.rank) {
                            entity.rank = content.rank;
                        }
                        if(content.compatibilities) {
                            entity.compatibilities = content.compatibilities;
                        }
                        if(content.id) {
                            entity.contentId = content.id;
                        }
                        if(content.type) {
                            entity.contentType = content.type;
                        }
                        if(content.discipline) {
                            entity.discipline = content.discipline;
                        }
                        if(content.domain) {
                            entity.domain = content.domain;
                        }
                        $scope[arrayName].push(entity);
                    });
                });
            }

            //TODO put this method to a service
            function findObjectOfArray(arr, propertyName, propertyValue, defaultValue) {
                if (arr) {
                    var iObject;
                    for (iObject = 0; iObject < arr.length; iObject++) {
                        if (arr[iObject][propertyName] === propertyValue) {
                            return arr[iObject];
                        }
                    }
                }
                if (defaultValue) {
                    return defaultValue;
                }
                return null;
            }

            function removeDomain (domain) {
                var i = 0;
                for (i; i < $scope.metadata.terminoDomains.length; i++) {
                    if ($scope.metadata.terminoDomains[i] === domain.id) {
                        $scope.metadata.terminoDomains.splice(i, 1);
                        $scope.checkboxDomain[domain.id] = false;
                        break;
                    }
                }
                if (domain.contentType === 'Discipline') {
                    var filteredDomains = $filter('filter')($scope.allDomains, {compatibilities: domain.contentId}, true);                    
                    angular.forEach(filteredDomains, function (filteredDomain) {
                        removeDomain(filteredDomain);
                    });
                }
                if (domain.contentType === 'Domain') {
                    var filteredSubDomains = $filter('filter')($scope.allSubDomains, {compatibilities: domain.contentId}, true);                    
                    angular.forEach(filteredSubDomains, function (filteredSubDomain) {
                        removeDomain(filteredSubDomain);
                    });
                }
            }

            function checkDomain (domain) {
                var filteredDomain = $filter('filter')($scope.metadata.terminoDomains, domain.id, true);
                if (filteredDomain.length === 0) {
                    $scope.metadata.terminoDomains.push(domain.id);
                    $scope.checkboxDomain[domain.id] = true;
                }
                if (domain.contentType === 'Discipline') {
                    var filteredDomains = $filter('filter')($scope.allDomains, {compatibilities: domain.contentId}, true);                    
                    angular.forEach(filteredDomains, function (filteredDomain) {
                        checkDomain(filteredDomain);
                    });
                }
                if (domain.contentType === 'Domain') {
                    var filteredSubDomains = $filter('filter')($scope.allSubDomains, {compatibilities: domain.contentId}, true);                    
                    angular.forEach(filteredSubDomains, function (filteredSubDomain) {
                        checkDomain(filteredSubDomain);
                    });
                }
            }

            $scope.changeTerminoUsageLanguage = function () {
                var terminoUsage = findObjectOfArray($scope.metadata.terminoUsage, 'lang', $scope.selectedTerminoUsageLanguage);
                if (terminoUsage !== null) {
                    $scope.terminoUsage = terminoUsage;
                } else {
                    terminoUsage = {lang: $scope.selectedTerminoUsageLanguage, value: ''};
                    $scope.terminoUsage = terminoUsage;
                }
            };

            $scope.updateTerminoUsage = function () {
                if ($scope.terminoUsage.value !== '') {
                    var terminoUsage = findObjectOfArray($scope.metadata.terminoUsage, 'lang', $scope.selectedTerminoUsageLanguage);
                    if (terminoUsage === null) {
                        terminoUsage = {lang: $scope.selectedTerminoUsageLanguage, value: $scope.terminoUsage.value};
                        if (angular.isUndefined($scope.metadata.terminoUsage)) {
                            $scope.metadata.terminoUsage = [];
                        }
                        $scope.metadata.terminoUsage.push(terminoUsage);
                    } else {
                        terminoUsage.value = $scope.terminoUsage.value;
                    }
                }
            };

            $scope.checkTerminoDomain = function (domain) {
                if (angular.isUndefined($scope.metadata.terminoDomains)) {
                    $scope.metadata.terminoDomains = [];
                }
                var filteredDomain = $filter('filter')($scope.metadata.terminoDomains, domain.id, true);
                if (filteredDomain.length > 0) {
                    removeDomain(domain);
                } else {
                    checkDomain(domain);
                }
            };

            /**
             * Initialize the scope
             **/

        	function init() {
                $scope.WorkspaceMetadataService = WorkspaceMetadataService;
                $scope.languages = [
                    {key: 'fr', value: $translate.instant('LANGUAGES.FR')},
                    {key: 'en', value: $translate.instant('LANGUAGES.EN')},
                    {key: 'es', value: $translate.instant('LANGUAGES.ES')},
                    {key: 'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];

                $scope.selectedTerminoUsageLanguage = 'fr';
                $scope.terminoUsage = {value: ''};
                if ($scope.metadata.terminoUsage) {
                    $scope.changeTerminoUsageLanguage();
                }

                addTerms('LanguageType', 'allLanguageType');
                addTerms('CorporaType', 'allCorporaType');
                addTerms('CorporaStyle', 'allCorporaStyles');
                addTerms('AnnotationLevel', 'allAnnotationLevels');
                loadLanguage('corporaLanguages');
                loadLanguage('corporaStudyLanguages');
                loadLanguage('lexiconInputLanguages');
                loadLanguage('lexiconDescriptionLanguages');
                loadLanguage('toolLanguages');
                loadLanguage('navigationLanguages');
                addTerms('FileFormat', 'allFileFormats');
                addTerms('FileEncoding', 'allFileEncodings');
                addTerms('DataType', 'allDataTypes');
                addTerms('LexiconAnnotation', 'allLexiconAnnotations');
                addTerms('OperatingSystem', 'allOperatingSystems');
                addTerms('ProgrammingLanguage', 'allProgrammingLanguages');
                addTerms('ToolSupport', 'allToolSupports');
                addTerms('ToolFunctionality', 'allToolFunctionalities');
                addTerms('StructureType', 'allStructureTypes');
                addTerms('DescriptionField', 'allDescriptionFields');
                loadLanguage('terminoInputLanguages');
                addTerms('Range', 'allRanges');
                addTerms('Discipline', 'allDisciplines');
                addTerms('Domain', 'allDomains');
                addTerms('SubDomain', 'allSubDomains');

                $scope.checkboxDomain = [];
                angular.forEach($scope.metadata.terminoDomains, function(domainId) {
                    $scope.checkboxDomain[domainId] = true;
                });
            }
            init();
}]);