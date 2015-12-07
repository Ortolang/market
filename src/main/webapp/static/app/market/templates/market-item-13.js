'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MarketItem13Ctrl
 * @description
 * # MarketItem13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MarketItem13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'SearchResource',
        function ($scope, $rootScope, $translate, Settings, Content, SearchResource) {


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

            function loadFieldValuesInAdditionalInformations(fieldKey, fieldName) {
                if($scope.content[fieldKey]) {
                    var fieldValues = [];
                    if(angular.isArray($scope.content[fieldKey])) {
                        angular.forEach($scope.content[fieldKey], function(ridOfValue) {

                            if(startsWith(ridOfValue, '#')) {
                                var queryOrtolangMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + ridOfValue;
                                SearchResource.json({query: queryOrtolangMeta}, function (jsonObject) {
                                    if(jsonObject.length>0) {
                                        fieldValues.push(angular.fromJson(jsonObject[0].this));
                                    }
                                });
                            } else {
                                fieldValues.push({'meta_ortolang-referentiel-json':{labels:[{lang:'fr',value:ridOfValue}]}});
                            }
                        });
                        $scope.additionalInformations.push({key: fieldKey, value: fieldValues, name: fieldName});
                    } else {

                        if(startsWith($scope.content[fieldKey], '#')) {
                            var queryOrtolangMeta = 'SELECT @this.toJSON("fetchPlan:*:-1") FROM ' + $scope.content[fieldKey];
                            SearchResource.json({query: queryOrtolangMeta}, function (jsonObject) {
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
                loadFieldValuesInAdditionalInformations('wordCount', 'WORKSPACE.METADATA_EDITOR.WORD_COUNT');

                loadFieldValuesInAdditionalInformations('lexiconInputType', 'MARKET.FACET.LEXICON_INPUT_TYPE');
                loadFieldValuesInAdditionalInformations('lexiconLanguageType', 'MARKET.FACET.LEXICON_LANGUAGE_TYPE');
                loadFieldValuesInAdditionalInformations('lexiconInputLanguages', 'MARKET.FACET.LEXICON_INPUT_LANGUAGE');
                loadFieldValuesInAdditionalInformations('lexiconInputCount', 'WORKSPACE.METADATA_EDITOR.LEXICON_INPUT_COUNT');
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


            $rootScope.$on('$translateChangeSuccess', function () {
                loadLicense($translate.use());
                loadConditionsOfUse($translate.use());
            });

        	function init() {
                $scope.documentations = [];
                $scope.additionalInformations = [];
                $scope.isArray = angular.isArray;

                loadLicense(Settings.language);
                loadConditionsOfUse(Settings.language);
                loadRelations();
                loadAdditionalInformations();
        	}
			init();
}]);