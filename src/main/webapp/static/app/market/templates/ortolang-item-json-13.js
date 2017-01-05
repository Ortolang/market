'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangItemJson13Ctrl
 * @description
 * # OrtolangItemJson13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangItemJson13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'Helper', 'ReferentialResource',
        function ($scope, $rootScope, $translate, Settings, Content, Helper, ReferentialResource) {

            function loadConditionsOfUse(lang) {
                if ($scope.content.conditionsOfUse !== undefined && $scope.content.conditionsOfUse !== '') {
                    $scope.conditionsOfUse = Helper.getMultilingualValue($scope.content.conditionsOfUse, 'lang', lang);
                }
            }

            function loadRelation(relation) {
                var url = null, name = 'unknown';
                if (relation.type === 'hasPart') {
                    url = relation.path;
                } else {
                    name = relation.path.split('/').pop();
                    url = Content.getContentUrlWithPath(relation.path, $scope.alias, $scope.root);
                    if (Helper.startsWith(relation.url, 'http')) {
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
                if ($scope.content.relations) {
                    angular.forEach($scope.content.relations, function (relation) {
                        if (relation.type === 'documentation') {
                            $scope.documentations.push(loadRelation(relation));
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
                    } else {

                        if (angular.isDefined($scope.content[fieldKey]['meta_ortolang-referential-json'])) {
                            // For market
                            $scope.additionalInformations.push({
                                key: fieldKey,
                                value: Helper.getMultilingualValue($scope.content[fieldKey]['meta_ortolang-referential-json'].labels, lang),
                                name: fieldName
                            });
                        } else if (Helper.startsWith($scope.content[fieldKey], '$')) {
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
                    var creationLocoationValue = '';
                    angular.forEach($scope.content.creationLocations, function (creationLocation) {
                        if (creationLocation.name) {
                            creationLocoationValue += (creationLocoationValue===''?'':', ') + creationLocation.name;
                        }
                    });
                    $scope.additionalInformations.push({
                        key: 'creationLocations',
                        value: creationLocoationValue,
                        name: 'ITEM.CREATION_LOCATIONS.LABEL'
                    });
                }

                loadFieldValuesInAdditionalInformations('originDate', 'ITEM.ORIGIN_DATE.LABEL', lang);

                loadFieldValuesInAdditionalInformations('linguisticDataType', 'ITEM.LINGUISTIC_DATA_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('discourseTypes', 'ITEM.DISCOURSE_TYPE.LABEL', lang);
                loadFieldValuesInAdditionalInformations('linguisticSubjects', 'ITEM.LINGUISTIC_SUBJECT.LABEL', lang);
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                loadConditionsOfUse($translate.use());
                loadCommercialLinks($translate.use());
                loadAdditionalInformations($translate.use());
            });

            function init() {
                loadConditionsOfUse(Settings.language);
                loadCommercialLinks(Settings.language);
                loadRelations();
                loadAdditionalInformations(Settings.language);
            }

            init();
        }]);
