'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangItemJson15Ctrl
 * @description
 * # OrtolangItemJson15Ctrl
 * Controller of the ortolangMarketApp
 * With object for any language not reference by a referential.
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangItemJson15Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'Helper',
        function ($scope, $rootScope, $translate, Settings, Content, Helper) {

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

            function loadAdditionalInformations(lang) {
                $scope.additionalInformations = Helper.loadCommonAdditionalInformations($scope.content, lang);

                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoType', 'ITEM.TERMINO_TYPE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoStructureType', 'ITEM.TERMINO_STRUCTURE_TYPE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoLanguageType', 'ITEM.TERMINO_LANGUAGE_TYPE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoDescriptionTypes', 'ITEM.TERMINO_DESCRIPTION_FIELD.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoInputLanguages', 'ITEM.TERMINO_INPUT_LANGUAGE.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoDomains', 'ITEM.TERMINO_DOMAIN.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoFormat', 'ITEM.TERMINO_FORMAT.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoInputCount', 'ITEM.TERMINO_INPUT_COUNT.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoVersion', 'ITEM.TERMINO_VERSION.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoControlled', 'ITEM.TERMINO_CONTROLLED.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoValidated', 'ITEM.TERMINO_VALIDATED.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoApproved', 'ITEM.TERMINO_APPROVED.LABEL', lang);
                Helper.loadFieldValuesInAdditionalInformations($scope.content, $scope.additionalInformations, 'terminoChecked', 'ITEM.TERMINO_CHECKED.LABEL', lang);
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
