'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:OrtolangItemJson13Ctrl
 * @description
 * # OrtolangItemJson13Ctrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('OrtolangItemJson13Ctrl', ['$scope', '$rootScope', '$translate', 'Settings', 'Content', 'Helper',
        function ($scope, $rootScope, $translate, Settings, Content, Helper) {

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

            $rootScope.$on('$translateChangeSuccess', function () {
                loadConditionsOfUse($translate.use());
                loadCommercialLinks($translate.use());
                $scope.additionalInformations = Helper.loadCommonAdditionalInformations($scope.content, $translate.use());
            });

            function init() {
                loadConditionsOfUse(Settings.language);
                loadCommercialLinks(Settings.language);
                loadRelations();
                $scope.additionalInformations = Helper.loadCommonAdditionalInformations($scope.content, Settings.language);
            }

            init();
        }]);
