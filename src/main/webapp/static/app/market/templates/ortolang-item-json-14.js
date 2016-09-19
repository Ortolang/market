'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangItemJson14Ctrl
 * @description
 * # OrtolangItemJson14Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangItemJson14Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'Helper', 'ReferentialResource',
        function ($scope, $rootScope, $translate, Settings, Content, Helper, ReferentialResource) {

            function loadConditionsOfUse(lang) {
                if ($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    $scope.conditionsOfUse = Helper.getMultilingualValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }

            function loadTerminoUsage(lang) {
                if ($scope.content.terminoUsage !== undefined && $scope.content.terminoUsage !== '') {
                    $scope.terminoUsage = Helper.getMultilingualValue($scope.content.terminoUsage, 'lang', lang);
                }
            }

            function loadRelation(relation) {
                var loadedRelation = {name: 'unknown', type: relation.type};
                if (relation.type === 'hasPart' || relation.type === 'isPartOf' || relation.type === 'requires' || relation.type === 'isRequiredBy') {
                    loadedRelation.name = relation.alias;
                    loadedRelation.url = 'market/item/' + relation.alias;
                } else {
                    loadedRelation.name = relation.path.split('/').pop();
                    loadedRelation.url = Content.getContentUrlWithPath(relation.path, $scope.alias, $scope.root);
                    if (Helper.startsWith(relation.url, 'http')) {
                        loadedRelation.url = relation.url;
                    }
                    loadedRelation.extension = relation.path.split('.').pop();
                }
                return loadedRelation;
            }

            function loadRelations() {
                $scope.documentations = [];
                $scope.externalRelations = [];
                if ($scope.content.relations) {
                    angular.forEach($scope.content.relations, function (relation) {
                        if (relation.type === 'documentation') {
                            $scope.documentations.push(loadRelation(relation));
                        } else if (relation.type === 'hasPart' || relation.type === 'isPartOf' || relation.type === 'requires' || relation.type === 'isRequiredBy') {
                            $scope.externalRelations.push(loadRelation(relation));
                        }
                    });
                }
            }

            function loadCommercialLinks(lang) {
                if ($scope.content.commercialLinks) {
                    $scope.commercialLinks = [];
                    angular.forEach($scope.content.commercialLinks, function (commercialLink) {
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

            $scope.isBoolean = function (value) {
                return typeof value === 'boolean';
            };

            function loadFieldValuesInAdditionalInformations(fieldKey, fieldName, lang) {
                if (angular.isDefined($scope.content[fieldKey])) {
                    var fieldValues = [];

                    // Array
                    if (angular.isArray($scope.content[fieldKey])) {
                        angular.forEach($scope.content[fieldKey], function (ridOfValue) {

                            if (angular.isDefined(ridOfValue['meta_ortolang-referential-json'])) {
                                // For market
                                fieldValues.push(Helper.getMultilingualValue(ridOfValue['meta_ortolang-referential-json'].labels, lang));
                            } else if (Helper.startsWith(ridOfValue, '$')) {
                                // For workspace
                                ReferentialResource.get({name: Helper.extractNameFromReferentialId(ridOfValue)}, function (entity) {
                                    var content = angular.fromJson(entity.content);
                                    fieldValues.push(Helper.getMultilingualValue(content.labels, lang));
                                });
                            } else {
                                // Not checked
                                fieldValues.push(ridOfValue);
                            }
                        });
                        $scope.additionalInformations.push({key: fieldKey, value: fieldValues, name: fieldName});

                        // String
                    } else if (angular.isString($scope.content[fieldKey])) {

                        if (Helper.startsWith($scope.content[fieldKey], '$')) {
                            // For workspace
                            ReferentialResource.get({name: Helper.extractNameFromReferentialId($scope.content[fieldKey])}, function (entity) {
                                var content = angular.fromJson(entity.content);
                                $scope.additionalInformations.push({
                                    key: fieldKey,
                                    value: Helper.getMultilingualValue(content.labels, lang),
                                    name: fieldName
                                });
                            });
                        } else {
                            // Not checked
                            $scope.additionalInformations.push({
                                key: fieldKey,
                                value: $scope.content[fieldKey],
                                name: fieldName
                            });
                        }
                    } else if (angular.isObject($scope.content[fieldKey])) {
                        if (angular.isDefined($scope.content[fieldKey]['meta_ortolang-referential-json'])) {
                            // For market
                            $scope.additionalInformations.push({
                                key: fieldKey,
                                value: Helper.getMultilingualValue($scope.content[fieldKey]['meta_ortolang-referential-json'].labels, lang),
                                name: fieldName
                            });
                        }
                    } else {
                        // Boolean
                        $scope.additionalInformations.push({
                            key: fieldKey,
                            value: $scope.content[fieldKey],
                            name: fieldName
                        });
                    }
                }
            }

            function loadAdditionalInformations(lang) {
                $scope.additionalInformations = [];

                loadFieldValuesInAdditionalInformations('statusOfUse', 'MARKET.FACET.STATUS_OF_USE', lang);

                loadFieldValuesInAdditionalInformations('corporaType', 'MARKET.FACET.CORPORA_TYPE', lang);
                loadFieldValuesInAdditionalInformations('corporaLanguageType', 'MARKET.FACET.CORPORA_LANGUAGE_TYPE', lang);
                loadFieldValuesInAdditionalInformations('corporaLanguages', 'MARKET.FACET.CORPORA_LANG', lang);
                loadFieldValuesInAdditionalInformations('corporaStudyLanguages', 'MARKET.FACET.CORPORA_STUDY_LANG', lang);
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

                if (angular.isDefined($scope.content.creationLocations)) {
                    angular.forEach($scope.content.creationLocations, function (creationLocation) {
                        if (creationLocation.name) {
                            $scope.additionalInformations.push({
                                key: 'creationLocations',
                                value: creationLocation.name,
                                name: 'ITEM.CREATION_LOCATIONS.LABEL'
                            });
                        }
                    });
                }

                loadFieldValuesInAdditionalInformations('originDate', 'ITEM.ORIGIN_DATE.LABEL', lang);

                loadFieldValuesInAdditionalInformations('linguisticDataType', 'ITEM.LINGUISTIC_DATA_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('discourseTypes', 'ITEM.DISCOURSE_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('linguisticSubjects', 'ITEM.LINGUISTIC_SUBJECT.LABEL', lang);

                loadFieldValuesInAdditionalInformations('terminoType', 'ITEM.TERMINO_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoStructureType', 'ITEM.TERMINO_STRUCTURE_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoLanguageType', 'ITEM.TERMINO_LANGUAGE_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoDescriptionTypes', 'ITEM.TERMINO_DESCRIPTION_FIELD.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoInputLanguages', 'ITEM.TERMINO_INPUT_LANGUAGE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoDomains', 'ITEM.TERMINO_DOMAIN.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoFormat', 'ITEM.TERMINO_FORMAT.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoInputCount', 'ITEM.TERMINO_INPUT_COUNT.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoVersion', 'ITEM.TERMINO_VERSION.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoControlled', 'ITEM.TERMINO_CONTROLED.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoValidated', 'ITEM.TERMINO_VALIDATED.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoApproved', 'ITEM.TERMINO_APPROVED.LABEL', lang);
                loadFieldValuesInAdditionalInformations('terminoChecked', 'ITEM.TERMINO_CHECKED.LABEL', lang);
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                loadConditionsOfUse($translate.use());
                loadTerminoUsage($translate.use());
                loadCommercialLinks($translate.use());
                loadAdditionalInformations($translate.use());
            });

            function init() {
                loadConditionsOfUse(Settings.language);
                loadTerminoUsage($translate.use());
                loadCommercialLinks(Settings.language);
                loadRelations();
                loadAdditionalInformations(Settings.language);
            }

            init();
        }]);
