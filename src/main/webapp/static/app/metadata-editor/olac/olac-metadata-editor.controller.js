'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:OlacMetadataEditorCtrl
 * @description
 * # OlacMetadataEditorCtrl
 * Controller of the ortolangMarketApp
 *
 */
angular.module('ortolangMarketApp').controller('OlacMetadataEditorCtrl', 
	['$scope', '$modal', '$translate', 'Helper', 
		function($scope, $modal, $translate, Helper) {

            $scope.addOlacElement = function(key, value, lang, type, code) {
                if (!$scope.selectedMetadata.content) {
                    $scope.selectedMetadata.content = {};
                }
                if (!$scope.selectedMetadata.content[key]) {
                    $scope.selectedMetadata.content[key] = [];
                }
                $scope.selectedMetadata.content[key].push({value: value, lang: lang, type: type, code: code});
            };

            $scope.deleteElement = function (key, value) {
                console.log(key);
                console.log(value);
                var index = $scope.selectedMetadata.content[key].indexOf(value);
                $scope.selectedMetadata.content[key].splice(index, 1);
                if ($scope.selectedMetadata.content[key].length === 0) {
                    delete $scope.selectedMetadata.content[key];
                }
                $scope.selectedMetadata.changed = true;
            };

            $scope.showAddElement = function (key, value) {
                var modalScope = Helper.createModalScope(true), 
                 modal;
                modalScope.olacElements = $scope.olacElementsObject;
                modalScope.languages = $scope.languages;
                modalScope.olacTypes = $scope.olacTypes;
                modalScope.olacCodes = $scope.olacCodes;
                if (key) {
                    modalScope.originalKey = key;
                    modalScope.models.key = key;
                    modalScope.models.value = value.value;
                    modalScope.models.lang = value.lang;
                    modalScope.models.type = value.type;
                    modalScope.models.code = value.code;
                }
                modalScope.submit = function (form) {
                    if (form.$valid) {
                        if (modalScope.originalKey) {
                            value.value = modalScope.models.value;
                            value.lang = modalScope.models.lang === '' ? undefined : modalScope.models.lang;
                            value.type = modalScope.models.type === '' ? undefined : modalScope.models.type;
                            value.code = modalScope.models.code === '' ? undefined : modalScope.models.code;
                        } else {
                            $scope.addOlacElement(modalScope.models.key, 
                                modalScope.models.value, 
                                modalScope.models.lang === '' ? undefined : modalScope.models.lang,
                                modalScope.models.type === '' ? undefined : modalScope.models.type,
                                modalScope.models.code === '' ? undefined : modalScope.models.code
                            );
                        }
                        $scope.selectedMetadata.changed = true;
                        modal.hide();
                    } else {
                        //TODO alert
                        console.log('form not valid');
                    }
                };
                modal = $modal({
                    scope: modalScope,
                    templateUrl: 'metadata-editor/olac/olac-element.modal.html',
                    show: true
                });
            };

            $scope.$watch('metadataEditorViewForm.$pristine', function () {
                //TODO dereference properly
                if ($scope.metadataEditorViewForm && $scope.metadataEditorViewForm.$pristine === false) {
                    $scope.selectedMetadata.changed = true;
                }
            }, true);

            (function init() {
                $scope.languages = [
                    {key: 'fr', value: $translate.instant('LANGUAGES.FR')},
                    {key: 'en', value: $translate.instant('LANGUAGES.EN')},
                    {key: 'es', value: $translate.instant('LANGUAGES.ES')},
                    {key: 'zh', value: $translate.instant('LANGUAGES.ZH')}
                ];
                $scope.olacTypes = [
                    'olac:role',
                    'discourse',
                    'W3C:datetime',
                    'DCMI:URI',
                    'DCMI:Space'
                ];
                $scope.olacCodes = [
                    'narrative',
                ];
            }());
		}
	]
);