'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItem13Ctrl
 * @description
 * # MarketItem13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItem13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'SearchResource', 'Helper',
        function ($scope, $rootScope, $translate, Settings, Content, SearchResource, Helper) {


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

            function loadProducers() {
                if($scope.content.producers) {
                    $scope.producers = [];

                    angular.forEach($scope.content.producers, function(producer) {
                        if(startsWith(producer, '$')) {
                            // From Workspace 
                            getReferentialByKey('organization', producer, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    var producerFromRef = angular.fromJson(jsonObject[0].this);
                                    $scope.producers.push(producerFromRef['meta_ortolang-referentiel-json']);
                                }
                            });
                        } else if(startsWith(producer, '#')) {
                            var queryEntityMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + producer;
                            SearchResource.json({query: queryEntityMeta}, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    var producerFromRef = angular.fromJson(jsonObject[0].this);
                                    $scope.producers.push(producerFromRef['meta_ortolang-referentiel-json']);
                                }
                            });
                        } else if(angular.isDefined(producer['meta_ortolang-referentiel-json'])) {
                            // From Market 
                            $scope.producers.push(producer['meta_ortolang-referentiel-json']);
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

                    angular.forEach($scope.content.contributors, function(contributor) {
                        var loadedContributor = {};
                        if(startsWith(contributor.entity, '#')) {
                            // From Market 
                            var queryEntityMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + contributor.entity;
                            SearchResource.json({query: queryEntityMeta}, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    var contributorEntityFromRef = angular.fromJson(jsonObject[0].this);
                                    loadedContributor.entity = contributorEntityFromRef['meta_ortolang-referentiel-json'];
                                }
                            });

                            if(contributor.roles && contributor.roles.length>0) {

                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function(role) {

                                    var queryRoleMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + role;
                                    SearchResource.json({query: queryRoleMeta}, function (jsonObject) {
                                        if(jsonObject.length>0) {
                                            var roleFromRef = angular.fromJson(jsonObject[0].this);
                                            loadedContributor.roles.push(roleFromRef['meta_ortolang-referentiel-json']);
                                        }
                                    });
                                });
                            }

                            if(contributor.organization) {

                                var queryOrganizationMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + contributor.organization;
                                SearchResource.json({query: queryOrganizationMeta}, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        var orgFromRef = angular.fromJson(jsonObject[0].this);
                                        loadedContributor.organization = orgFromRef['meta_ortolang-referentiel-json'];
                                    }
                                });
                            }

                            $scope.contributors.push(loadedContributor);

                        } else if(startsWith(contributor.entity, '$')) {
                            // From Workspace preview with contributor inside the referential
                            getReferentialByKey('person', contributor.entity, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    var contributorEntityFromRef = angular.fromJson(jsonObject[0].this);
                                    loadedContributor.entity = contributorEntityFromRef['meta_ortolang-referentiel-json'];
                                }
                            });

                            if(contributor.roles && contributor.roles.length>0) {
                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function(role) {
                                    getReferentialByKey('term', role, function (jsonObject) {
                                        if(jsonObject.length>0) {
                                            var roleFromRef = angular.fromJson(jsonObject[0].this);
                                            loadedContributor.roles.push(roleFromRef['meta_ortolang-referentiel-json']);
                                        }
                                    });
                                });
                            }

                            if(contributor.organization) {
                                getReferentialByKey('organization', contributor.organization, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        var orgFromRef = angular.fromJson(jsonObject[0].this);
                                        loadedContributor.organization = orgFromRef['meta_ortolang-referentiel-json'];
                                    }
                                });
                            }

                            $scope.contributors.push(loadedContributor);

                        } else if(angular.isDefined(contributor.entity['meta_ortolang-referentiel-json'])) {
                            // From Market with contributor inside the referential
                            $scope.contributors.push(contributor.entity['meta_ortolang-referentiel-json']);
                        } else {
                            // From Workspace (Contributor that needs to be checked) and Market with contributor outside the referential
                            loadedContributor.entity = contributor.entity;

                            if(contributor.organization) {
                                getReferentialByKey('organization', contributor.organization, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        var orgFromRef = angular.fromJson(jsonObject[0].this);
                                        loadedContributor.organization = orgFromRef['meta_ortolang-referentiel-json'];
                                    }
                                });
                            }

                            if(contributor.roles && contributor.roles.length>0) {

                                loadedContributor.roles = [];
                                angular.forEach(contributor.roles, function(role) {

                                    if(startsWith(role, '#')) {
                                        var queryRoleMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + role;
                                        SearchResource.json({query: queryRoleMeta}, function (jsonObject) {
                                            if(jsonObject.length>0) {
                                                var roleFromRef = angular.fromJson(jsonObject[0].this);
                                                loadedContributor.roles.push(roleFromRef['meta_ortolang-referentiel-json']);
                                            }
                                        });
                                    } else { // Starts by $
                                        getReferentialByKey('term', role, function (jsonObject) {
                                            if(jsonObject.length>0) {
                                                var roleFromRef = angular.fromJson(jsonObject[0].this);
                                                loadedContributor.roles.push(roleFromRef['meta_ortolang-referentiel-json']);
                                            }
                                        });
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
                        getReferentialByKey('license', $scope.content.license, function (jsonObject) {
                            if(jsonObject.length>0) {
                                var licenseFromRef = angular.fromJson(jsonObject[0].this);
                                $scope.license = licenseFromRef['meta_ortolang-referentiel-json'];
                                if($scope.license.text) {
                                    $scope.licenseText = getValue($scope.license.text, 'lang', lang);
                                }
                            }
                        });
                    } else if(angular.isDefined($scope.content.license['meta_ortolang-referentiel-json'])) {
                        // From Market 
                        $scope.license = $scope.content.license['meta_ortolang-referentiel-json'];
                        if($scope.license.text) {
                            $scope.licenseText = getValue($scope.license.text, 'lang', lang);
                        }
                    }
                }
        	}

            function loadConditionsOfUse(lang) {
                if($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    $scope.conditionsOfUse = getValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }

            function loadSponsors(lang) {
                if($scope.content.sponsors !== undefined && $scope.content.sponsors.length>0) {
                    $scope.sponsors = [];

                    angular.forEach($scope.content.sponsors, function(sponsor) {
                        if(startsWith(sponsor, '$')) {
                            // From Workspace
                            getReferentialByKey('term', sponsor, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    var sponsorFromRef = angular.fromJson(jsonObject[0].this);
                                    $scope.sponsors.push(getValue(sponsorFromRef['meta_ortolang-referentiel-json'].labels, 'lang', lang));
                                }
                            });
                        } else if(angular.isDefined(sponsor['meta_ortolang-referentiel-json'])) {
                            // For Market
                            $scope.sponsors.push(getValue(sponsor['meta_ortolang-referentiel-json'].labels, 'lang', lang));
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
                        label: getValue(relation.label, 'lang', lang, 'unknown'),
                        name: name,
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

            function loadCommerciaLinks(lang) {
                if ($scope.content.commercialLinks) {
                    $scope.commercialLinks = [];
                    angular.forEach($scope.content.commercialLinks, function(commercialLink) {
                        $scope.commercialLinks.push(
                            {
                                description: getValue(commercialLink.description, 'lang', lang, 'unknown'),
                                acronym: commercialLink.acronym,
                                url: commercialLink.url,
                                img: commercialLink.img
                            }
                        );
                    });
                }
            }

            function loadFieldValuesInAdditionalInformations(fieldKey, fieldName) {
                if($scope.content[fieldKey]) {
                    var fieldValues = [];
                    if(angular.isArray($scope.content[fieldKey])) {
                        angular.forEach($scope.content[fieldKey], function(ridOfValue) {

                            if(startsWith(ridOfValue, '#')) {
                                // For Market
                                var queryOrtolangMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + ridOfValue;
                                SearchResource.json({query: queryOrtolangMeta}, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        fieldValues.push(angular.fromJson(jsonObject[0].this));
                                    }
                                });
                            } else if(ridOfValue['meta_ortolang-referentiel-json']) {
                                if(angular.isDefined(ridOfValue['meta_ortolang-referentiel-json'])) {
                                    // For market
                                    fieldValues.push(ridOfValue);
                                } else {
                                    // For Workspace (value needs to be checked)
                                    fieldValues.push({'meta_ortolang-referentiel-json':{labels:[{lang:'fr',value:ridOfValue}]}});
                                }
                            } else if(startsWith(ridOfValue, '$')) {
                                // For Workspace
                                var queryMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM term WHERE key="' + ridOfValue.substring(2, ridOfValue.length-1)+'"';
                                SearchResource.json({query: queryMeta}, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        fieldValues.push(angular.fromJson(jsonObject[0].this));
                                    }
                                });
                            }
                        });
                        $scope.additionalInformations.push({key: fieldKey, value: fieldValues, name: fieldName});
                    } else {

                        if(startsWith($scope.content[fieldKey], '#')) {
                            // For Workspace
                            var queryOrtolangMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + $scope.content[fieldKey];
                            SearchResource.json({query: queryOrtolangMeta}, function (jsonObject) {
                                if(jsonObject.length>0) {
                                    $scope.additionalInformations.push({key: fieldKey, value: angular.fromJson(jsonObject[0].this), name: fieldName});
                                }
                            });
                        } else if(startsWith($scope.content[fieldKey], '$')) {
                                // For Workspace
                                var queryMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM term WHERE key="' + $scope.content[fieldKey].substring(2, $scope.content[fieldKey].length-1)+'"';
                                SearchResource.json({query: queryMeta}, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        $scope.additionalInformations.push({key: fieldKey, value: angular.fromJson(jsonObject[0].this), name: fieldName});
                                    }
                                });
                        } else {
                            $scope.additionalInformations.push({key: fieldKey, value: $scope.content[fieldKey], name: fieldName});
                        }
                    }
                }
            }

            function loadAdditionalInformations() {
                //TODO add keywords
                // loadFieldValuesInAdditionalInformations('keywords', 'MARKET.KEYWORDS');

                loadFieldValuesInAdditionalInformations('corporaType', 'MARKET.FACET.CORPORA_TYPE');
                loadFieldValuesInAdditionalInformations('corporaLanguageType', 'MARKET.FACET.CORPORA_LANGUAGE_TYPE');
                loadFieldValuesInAdditionalInformations('corporaLanguages', 'MARKET.FACET.CORPORA_LANG');
                loadFieldValuesInAdditionalInformations('corporaStyles', 'MARKET.FACET.CORPORA_STYLES');
                loadFieldValuesInAdditionalInformations('annotationLevels', 'MARKET.FACET.ANNOTATION_LEVEL');
                loadFieldValuesInAdditionalInformations('corporaFormats', 'MARKET.FACET.TEXT_FORMAT');
                loadFieldValuesInAdditionalInformations('corporaFileEncodings', 'MARKET.FACET.TEXT_ENCODING');
                loadFieldValuesInAdditionalInformations('corporaDataTypes', 'MARKET.FACET.CORPORA_DATATYPES');
                // loadFieldValuesInAdditionalInformations('wordCount', 'WORKSPACE.METADATA_EDITOR.WORD_COUNT');

                loadFieldValuesInAdditionalInformations('lexiconInputType', 'MARKET.FACET.LEXICON_INPUT_TYPE');
                loadFieldValuesInAdditionalInformations('lexiconLanguageType', 'MARKET.FACET.LEXICON_LANGUAGE_TYPE');
                loadFieldValuesInAdditionalInformations('lexiconInputLanguages', 'MARKET.FACET.LEXICON_INPUT_LANGUAGE');
                // loadFieldValuesInAdditionalInformations('lexiconInputCount', 'WORKSPACE.METADATA_EDITOR.LEXICON_INPUT_COUNT');
                loadFieldValuesInAdditionalInformations('lexiconDescriptionTypes', 'MARKET.FACET.LEXICON_DESCRIPTION_TYPE');
                loadFieldValuesInAdditionalInformations('lexiconDescriptionLanguages', 'MARKET.FACET.LEXICON_DESCRIPTION_LANGUAGE');
                loadFieldValuesInAdditionalInformations('lexiconFormats', 'MARKET.FACET.LEXICON_FORMAT');

                loadFieldValuesInAdditionalInformations('operatingSystems', 'WORKSPACE.METADATA_EDITOR.OPERATING_SYSTEMS');
                loadFieldValuesInAdditionalInformations('programmingLanguages', 'MARKET.PROGRAMMING_LANGUAGE');
                loadFieldValuesInAdditionalInformations('toolFunctionalities', 'MARKET.FACET.TOOL_FUNCTIONALITY');
                loadFieldValuesInAdditionalInformations('toolInputData', 'MARKET.FACET.TOOL_INPUTDATA');
                loadFieldValuesInAdditionalInformations('toolOutputData', 'MARKET.FACET.TOOL_OUTPUTDATA');
                loadFieldValuesInAdditionalInformations('toolFileEncodings', 'MARKET.FACET.TOOL_FILE_ENCODINGS');
                loadFieldValuesInAdditionalInformations('toolLanguages', 'MARKET.FACET.TOOL_LANGUAGE');
                loadFieldValuesInAdditionalInformations('navigationLanguages', 'WORKSPACE.METADATA_EDITOR.NAVIGATION_LANGUAGES');
                loadFieldValuesInAdditionalInformations('toolSupport', 'WORKSPACE.METADATA_EDITOR.TOOL_SUPPORT');

            }

            function startsWith (actual, expected) {
                var lowerStr = (actual + '').toLowerCase();
                return lowerStr.indexOf(expected.toLowerCase()) === 0;
            }

            function getReferentialByKey(type, key, func) {
                var queryRoleByKey = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM '+type+' WHERE key="' + Helper.extractKeyFromReferentialId(key) + '"';
                SearchResource.json({query: queryRoleByKey}, func);
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                loadLicense($translate.use());
                loadConditionsOfUse($translate.use());
                loadCommerciaLinks($translate.use());
                loadSponsors($translate.use());
            });

        	function init() {
                $scope.documentations = [];
                $scope.additionalInformations = [];
                $scope.isArray = angular.isArray;

                loadProducers();
                loadContributors();
                loadSponsors(Settings.language);
                loadLicense(Settings.language);
                loadConditionsOfUse(Settings.language);
                loadCommerciaLinks(Settings.language);
                loadRelations();
                loadAdditionalInformations();
        	}
			init();
}]);