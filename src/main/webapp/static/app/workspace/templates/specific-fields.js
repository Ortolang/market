'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:SpecificFieldsCtrl
 * @description
 * # SpecificFieldsCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('SpecificFieldsCtrl', ['$rootScope', '$scope', '$filter', '$translate', 'Settings', 'Helper', '$q', '$modal', 'ReferentialResource', 'SearchResource', 'WorkspaceMetadataService', 'icons',
        function ($rootScope, $scope, $filter, $translate, Settings, Helper, $q, $modal, ReferentialResource, SearchResource, WorkspaceMetadataService, icons) {

            $scope.suggestLanguages = function (term) {
                if(term.length<2) {
                    return [];
                }
                var deferred = $q.defer();
                SearchResource.languages({'labels.value*': term}, function(results) {
                    var suggestedLanguages = [];
                    angular.forEach(results, function(refentity) {
                        var content = refentity;
                        var text = Helper.getMultilingualValue(content.labels);
                        if(text) {
                            suggestedLanguages.push({id: Helper.createKeyFromReferentialId(content.key), label: text, content: content});
                        }
                    });
                    deferred.resolve(suggestedLanguages);
                }, function () {
                    deferred.reject([]);
                });
                return deferred.promise;
            };

            $scope.addLanguage = function(name, tag) {
                WorkspaceMetadataService.addLanguage(tag, name);
            };

            $scope.removeLanguage = function(name, tag) {
                var index = $scope.metadata[name+'Entity'].indexOf(tag);
                if (index > -1) {
                    $scope.metadata[name].splice(index, 1);
                }
            };

            $scope.showAddLanguageModal = function (languagesId, language) {
                if (!WorkspaceMetadataService.canEdit) {
                    return;
                }
                var modalScope = Helper.createModalScope(true);
                modalScope.metadataLanguagesId = languagesId;
                if (language) {
                    modalScope.language = language;
                }

                $modal({
                    scope: modalScope,
                    templateUrl: 'workspace/templates/add-language-modal.html',
                    show: true
                });
            };

            function loadLanguage(name) {
                // Array of the selected language
                $scope.metadata[name+'Entity'] = [];
                if(angular.isDefined($scope.metadata[name])) {
                    angular.forEach($scope.metadata[name], function(lang) {
                        var language = {label: lang};
                        if (typeof lang  === 'string') {
                            ReferentialResource.get({name:Helper.extractNameFromReferentialId(lang)}, function (entity) {
                                language.id = Helper.createKeyFromReferentialId(entity.key);
                                language.label = Helper.getMultilingualValue(entity.content.labels);
                                language.content = entity.content;
                            },
                            function () {
                                language.id = lang;
                                language.label = lang;
                            });
                        } else {
                            // lang is an object
                            language.label = Helper.getMultilingualValue(lang.labels);
                            language.content = lang;
                        }
                        $scope.metadata[name+'Entity'].push(language);
                    });
                }
            }

            function addTerms(compatibility, arrayName) {

                $scope[arrayName] = [];

                ReferentialResource.list({type: compatibility.toUpperCase()}, function(entities) {
                    angular.forEach(entities.entries, function(entry) {
                        var entity = {id: Helper.createKeyFromReferentialId(entry.key), label: Helper.getMultilingualValue(entry.content.labels)};
                        if(entry.content.rank) {
                            entity.rank = entry.content.rank;
                        }
                        if(entry.content.compatibilities) {
                            entity.compatibilities = entry.content.compatibilities;
                        }
                        if(entry.content.id) {
                            entity.contentId = entry.content.id;
                        }
                        if(entry.content.type) {
                            entity.contentType = entry.content.type;
                        }
                        if(entry.content.discipline) {
                            entity.discipline = entry.content.discipline;
                        }
                        if(entry.content.domain) {
                            entity.domain = entry.content.domain;
                        }
                        $scope[arrayName].push(entity);
                    });
                });
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
                var terminoUsage = Helper.findObjectOfArray($scope.metadata.terminoUsage, 'lang', $scope.selectedTerminoUsageLanguage);
                if (terminoUsage !== null) {
                    $scope.terminoUsage = terminoUsage;
                } else {
                    terminoUsage = {lang: $scope.selectedTerminoUsageLanguage, value: ''};
                    $scope.terminoUsage = terminoUsage;
                }
            };

            $scope.updateTerminoUsage = function () {
                if ($scope.terminoUsage.value !== '') {
                    var terminoUsage = Helper.findObjectOfArray($scope.metadata.terminoUsage, 'lang', $scope.selectedTerminoUsageLanguage);
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

            function createTagsInputTemplateScope(languagesId) {
                $scope['tagsInputTemplate'+languagesId+'Scope'] = Helper.createModalScope(true);
                $scope['tagsInputTemplate'+languagesId+'Scope'].showAddLanguageModal = $scope.showAddLanguageModal;
                $scope['tagsInputTemplate'+languagesId+'Scope'].metadataLanguagesId = languagesId;
                $scope['tagsInputTemplate'+languagesId+'Scope'].icons = icons;
            }

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

                createTagsInputTemplateScope('corporaLanguages');
                createTagsInputTemplateScope('corporaStudyLanguages');
                createTagsInputTemplateScope('navigationLanguages');
                createTagsInputTemplateScope('toolLanguages');
                createTagsInputTemplateScope('lexiconInputLanguages');
                createTagsInputTemplateScope('lexiconDescriptionLanguages');
                createTagsInputTemplateScope('terminoInputLanguages');

                $scope.checkboxDomain = [];
                angular.forEach($scope.metadata.terminoDomains, function(domainId) {
                    $scope.checkboxDomain[domainId] = true;
                });
            }
            init();
}]);
