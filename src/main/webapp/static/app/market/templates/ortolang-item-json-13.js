'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangItemJson13Ctrl
 * @description
 * # OrtolangItemJson13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangItemJson13Ctrl', ['$scope', '$rootScope', '$translate', 'url', 'Settings', 'Content', 'Helper', 'ReferentialEntityResource',
        function ($scope, $rootScope, $translate, url, Settings, Content, Helper, ReferentialEntityResource) {

            function loadProducers() {
                if($scope.content.producers) {
                    $scope.producers = [];

                    angular.forEach($scope.content.producers, function(producer) {
                        if(startsWith(producer, '$')) {
                            ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(producer)}, function(entity) {
                                var contentOrganization = angular.fromJson(entity.content);
                                $scope.producers.push(contentOrganization);
                                    
                            });
                        } else if(angular.isDefined(producer['meta_ortolang-referential-json'])) {
                            // From Market 
                            $scope.producers.push(producer['meta_ortolang-referential-json']);
                        } else {
                            // From Workspace (Producer that needs to be checked)
                            $scope.producers.push(producer);
                        }
                    });
                }
            }

            function loadContributors() {
                if($scope.content.contributors) {
                    $scope.contributors = [];
                    $scope.authors = [];

                    angular.forEach($scope.content.contributors, function(contributor) {
                        var loadedContributor = {};
                        if(startsWith(contributor.entity, '$')) {
                            // From Workspace preview with contributor inside the referential
                            ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.entity)}, function(entity) {
                                    loadedContributor.entity = angular.fromJson(entity.content);
                            });

                            if(contributor.roles && contributor.roles.length>0) {
                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function(role) {
                                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(role)}, function(entity) {
                                            var contentRole = angular.fromJson(entity.content);
                                            loadedContributor.roles.push(Helper.getMultilingualValue(contentRole.labels));

                                            if(contentRole.id==='author') {
                                                $scope.authors.push(loadedContributor);
                                            }
                                    });
                                });
                            }

                            if(contributor.organization) {
                                ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function(entity) {
                                        var contentOrganization = angular.fromJson(entity.content);
                                        loadedContributor.organization = contentOrganization;
                                });
                            }

                            $scope.contributors.push(loadedContributor);

                        } else if(angular.isDefined(contributor.entity['meta_ortolang-referential-json'])) {
                            // From Market with contributor from referential
                            loadedContributor.entity = contributor.entity['meta_ortolang-referential-json'];
                            if(angular.isDefined(contributor.organization)) {
                                loadedContributor.organization = contributor.organization['meta_ortolang-referential-json'];
                            }
                            loadedContributor.roles = [];
                            angular.forEach(contributor.roles, function(role) {
                                loadedContributor.roles.push(Helper.getMultilingualValue(role['meta_ortolang-referential-json'].labels));

                                if(role['meta_ortolang-referential-json'].id==='author') {
                                    $scope.authors.push(loadedContributor);
                                }
                            });

                            $scope.contributors.push(loadedContributor);
                        } else {
                            // From Workspace (Contributor that needs to be checked) and Market with contributor outside the referential
                            loadedContributor.entity = contributor.entity;

                            if(contributor.organization) {
                                if(startsWith(contributor.organization, '$')) {
                                    ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(contributor.organization)}, function(entity) {
                                        var contentOrganization = angular.fromJson(entity.content);
                                        loadedContributor.organization = contentOrganization;
                                    });
                                } else {
                                    loadedContributor.organization = contributor.organization['meta_ortolang-referential-json'];
                                }
                            }

                            if(contributor.roles && contributor.roles.length>0) {

                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function(role) {
                                    if(startsWith(role, '$')) {
                                        ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(role)}, function(entity) {
                                            var contentRole = angular.fromJson(entity.content);
                                            loadedContributor.roles.push(Helper.getMultilingualValue(contentRole.labels));
                                            
                                            if(contentRole.id==='author') {
                                                $scope.authors.push(loadedContributor);
                                            }
                                        });
                                    } else {
                                        loadedContributor.roles.push(Helper.getMultilingualValue(role['meta_ortolang-referential-json'].labels));
                                        
                                        if(role['meta_ortolang-referential-json'].id==='author') {
                                            $scope.authors.push(loadedContributor);
                                        }
                                    }
                                });
                            }
                            $scope.contributors.push(loadedContributor);
                        }
                    });
                }
            }

        	function loadLicense(lang) {
                if($scope.content.license) {
                    if(startsWith($scope.content.license, '$')) {
                        // From Workspace
                        ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId($scope.content.license)}, function(entity) {
                            $scope.license = angular.fromJson(entity.content);
                            if($scope.license.description) {
                                $scope.license.effectiveDescription = Helper.getMultilingualValue($scope.license.description, lang);
                            }
                            if($scope.license.text) {
                                $scope.license.effectiveText = Helper.getMultilingualValue($scope.license.text, lang);
                            }
                        });
                    } else if(angular.isDefined($scope.content.license['meta_ortolang-referential-json'])) {
                        // From Market 
                        $scope.license = $scope.content.license['meta_ortolang-referential-json'];
                        if($scope.license.description) {
                            $scope.license.effectiveDescription = Helper.getMultilingualValue($scope.license.description, lang);
                        }
                        if($scope.license.text) {
                            $scope.license.effectiveText = Helper.getMultilingualValue($scope.license.text, lang);
                        }
                    }
                    //TOOD licence made by user ??
                }
        	}

            function loadConditionsOfUse(lang) {
                if($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    $scope.conditionsOfUse = Helper.getMultilingualValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }

            function loadSponsors(lang) {
                if($scope.content.sponsors !== undefined && $scope.content.sponsors.length>0) {
                    $scope.sponsors = [];

                    angular.forEach($scope.content.sponsors, function(sponsor) {
                        if(startsWith(sponsor, '$')) {
                            // From Workspace
                            ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(sponsor)}, function(entity) {
                                var content = angular.fromJson(entity.content);
                                $scope.sponsors.push(content.fullname);
                            });
                        } else if(angular.isDefined(sponsor['meta_ortolang-referential-json'])) {
                            // For Market
                            $scope.sponsors.push(sponsor['meta_ortolang-referential-json'].fullname);
                        }
                    });
                }
            }

            function loadRelation(relation, lang) {
                var url = null, name = 'unknown';
                if(relation.type==='hasPart') {
                    url = relation.path;
                } else {
                    name = relation.path.split('/').pop();
                    url = Content.getContentUrlWithPath(relation.path, $scope.alias, $scope.root);
                    if (startsWith(relation.url, 'http')) {
                        url = relation.url;
                    }
                }
                
                return {
                        name: name,
                        type: relation.type,
                        url: url,
                        extension: relation.path.split('.').pop()
                    };
            }

            function loadRelations() {
                $scope.documentations = [];
                if($scope.content.relations) {
                    angular.forEach($scope.content.relations, function(relation) {
                        if(relation.type === 'documentation') {
                            $scope.documentations.push(loadRelation(relation));
                        }
                    });
                }
            }

            function loadCommerciaLinks(lang) {
                if ($scope.content.commercialLinks) {
                    $scope.commercialLinks = [];
                    angular.forEach($scope.content.commercialLinks, function(commercialLink) {
                        $scope.commercialLinks.push(
                            {
                                description: Helper.getMultilingualValue(commercialLink.description, 'lang', lang),
                                acronym: commercialLink.acronym,
                                url: commercialLink.url,
                                img: commercialLink.img
                            }
                        );
                    });
                }
            }

            function loadFieldValuesInAdditionalInformations(fieldKey, fieldName, lang) {
                if($scope.content[fieldKey]) {
                    var fieldValues = [];
                    if(angular.isArray($scope.content[fieldKey])) {
                        angular.forEach($scope.content[fieldKey], function(ridOfValue) {

                            if(angular.isDefined(ridOfValue['meta_ortolang-referential-json'])) {
                                // For market
                                fieldValues.push(Helper.getMultilingualValue(ridOfValue['meta_ortolang-referential-json'].labels, lang));
                            } else if(startsWith(ridOfValue, '$')) {
                                // For workspace
                                ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId(ridOfValue)}, function(entity) {
                                    var content = angular.fromJson(entity.content);
                                    fieldValues.push(Helper.getMultilingualValue(content.labels, lang));
                                });
                            } else {
                                // Not checked
                                fieldValues.push(ridOfValue);
                            }
                        });
                        $scope.additionalInformations.push({key: fieldKey, value: fieldValues, name: fieldName});
                    } else {

                        if(angular.isDefined($scope.content[fieldKey]['meta_ortolang-referential-json'])) {
                            // For market
                            $scope.additionalInformations.push({
                                key: fieldKey, 
                                value: Helper.getMultilingualValue($scope.content[fieldKey]['meta_ortolang-referential-json'].labels, lang), 
                                name: fieldName
                            });
                        } else if(startsWith($scope.content[fieldKey], '$')) {
                            // For workspace
                            ReferentialEntityResource.get({name: Helper.extractNameFromReferentialId($scope.content[fieldKey])}, function(entity) {
                                var content = angular.fromJson(entity.content);
                                $scope.additionalInformations.push({
                                    key: fieldKey, 
                                    value: Helper.getMultilingualValue(content.labels, lang), 
                                    name: fieldName
                                });
                            });
                        } else {
                            // Not checked
                            $scope.additionalInformations.push({key: fieldKey, value: $scope.content[fieldKey], name: fieldName});
                        }
                    }
                }
            }

            function loadAdditionalInformations(lang) {
                $scope.additionalInformations = [];
                //TODO add keywords
                // loadFieldValuesInAdditionalInformations('keywords', 'MARKET.KEYWORDS');

                loadFieldValuesInAdditionalInformations('corporaType', 'MARKET.FACET.CORPORA_TYPE', lang);
                loadFieldValuesInAdditionalInformations('corporaLanguageType', 'MARKET.FACET.CORPORA_LANGUAGE_TYPE', lang);
                loadFieldValuesInAdditionalInformations('corporaLanguages', 'MARKET.FACET.CORPORA_LANG', lang);
                loadFieldValuesInAdditionalInformations('corporaStudyLanguages', 'MARKET.FACET.CORPORA_LANG', lang);
                loadFieldValuesInAdditionalInformations('corporaStyles', 'MARKET.FACET.CORPORA_STYLES', lang);
                loadFieldValuesInAdditionalInformations('annotationLevels', 'MARKET.FACET.ANNOTATION_LEVEL', lang);
                loadFieldValuesInAdditionalInformations('corporaFormats', 'MARKET.FACET.TEXT_FORMAT', lang);
                loadFieldValuesInAdditionalInformations('corporaFileEncodings', 'MARKET.FACET.TEXT_ENCODING', lang);
                loadFieldValuesInAdditionalInformations('corporaDataTypes', 'MARKET.FACET.CORPORA_DATATYPES', lang);
                loadFieldValuesInAdditionalInformations('wordCount', 'WORKSPACE.METADATA_EDITOR.WORD_COUNT');

                loadFieldValuesInAdditionalInformations('lexiconInputType', 'MARKET.FACET.LEXICON_INPUT_TYPE', lang);
                loadFieldValuesInAdditionalInformations('lexiconLanguageType', 'MARKET.FACET.LEXICON_LANGUAGE_TYPE', lang);
                loadFieldValuesInAdditionalInformations('lexiconInputLanguages', 'MARKET.FACET.LEXICON_INPUT_LANGUAGE', lang);
                loadFieldValuesInAdditionalInformations('lexiconInputCount', 'WORKSPACE.METADATA_EDITOR.LEXICON_INPUT_COUNT');
                loadFieldValuesInAdditionalInformations('lexiconDescriptionTypes', 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE', lang);
                loadFieldValuesInAdditionalInformations('lexiconDescriptionLanguages', 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE', lang);
                loadFieldValuesInAdditionalInformations('lexiconFormats', 'MARKET.FACET.LEXICON_FORMAT', lang);

                loadFieldValuesInAdditionalInformations('operatingSystems', 'WORKSPACE.METADATA_EDITOR.OPERATING_SYSTEMS', lang);
                loadFieldValuesInAdditionalInformations('programmingLanguages', 'MARKET.PROGRAMMING_LANGUAGE', lang);
                loadFieldValuesInAdditionalInformations('toolFunctionalities', 'MARKET.FACET.TOOL_FUNCTIONALITY', lang);
                loadFieldValuesInAdditionalInformations('toolInputData', 'MARKET.FACET.TOOL_INPUTDATA', lang);
                loadFieldValuesInAdditionalInformations('toolOutputData', 'MARKET.FACET.TOOL_OUTPUTDATA', lang);
                loadFieldValuesInAdditionalInformations('toolFileEncodings', 'MARKET.FACET.TOOL_FILE_ENCODINGS', lang);
                loadFieldValuesInAdditionalInformations('toolLanguages', 'MARKET.FACET.TOOL_LANGUAGE', lang);
                loadFieldValuesInAdditionalInformations('navigationLanguages', 'WORKSPACE.METADATA_EDITOR.NAVIGATION_LANGUAGES', lang);
                loadFieldValuesInAdditionalInformations('toolSupport', 'WORKSPACE.METADATA_EDITOR.TOOL_SUPPORT', lang);

            }

            function startsWith (actual, expected) {
                var lowerStr = (actual + '').toLowerCase();
                return lowerStr.indexOf(expected.toLowerCase()) === 0;
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                loadLicense($translate.use());
                loadConditionsOfUse($translate.use());
                loadCommerciaLinks($translate.use());
                loadSponsors($translate.use());
                loadAdditionalInformations($translate.use());
            });

        	function init() {
                $scope.isArray = angular.isArray;
                $scope.handle = 'http://hdl.handle.net/' + url.handlePrefix + '/' + $scope.alias;

                loadProducers();
                loadContributors();
                loadSponsors(Settings.language);
                loadLicense(Settings.language);
                loadConditionsOfUse(Settings.language);
                loadCommerciaLinks(Settings.language);
                loadRelations();
                loadAdditionalInformations(Settings.language);
        	}
			init();
}]);