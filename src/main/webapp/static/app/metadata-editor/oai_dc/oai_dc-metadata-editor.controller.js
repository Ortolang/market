'use strict';

/**
 * @ngdoc controller
 * @name ortolangMarketApp.controller:OaiDcMetadataEditorCtrl
 * @description
 * # OaiDcMetadataEditorCtrl
 * Controller of the ortolangMarketApp
 *
 */
angular.module('ortolangMarketApp').controller('OaiDcMetadataEditorCtrl', 
	['$scope', '$modal', 'Helper', 
		function($scope, $modal, Helper) {

            $scope.addDcElement = function(key, value, lang) {
                if (!$scope.selectedMetadata.content) {
                    $scope.selectedMetadata.content = {};
                }
                if (!$scope.selectedMetadata.content[key]) {
                    $scope.selectedMetadata.content[key] = [];
                }
                $scope.selectedMetadata.content[key].push({value: value, lang: lang});
            };

            $scope.showAddElement = function (key, value) {
                var modalScope = Helper.createModalScope(true), 
                 modal;
                modalScope.dcElements = $scope.dcElementsObject;
                if (key) {
                    modalScope.originalKey = key;
                    modalScope.models.key = key;
                    modalScope.models.value = value.value;
                    modalScope.models.lang = value.lang;
                }
                modalScope.submit = function (form) {
                    if (form.$valid) {
                        if (modalScope.originalKey) {
                            value.value = modalScope.models.value;
                            value.lang = modalScope.models.lang === '' ? undefined : modalScope.models.lang;
                        } else {
                            $scope.addDcElement(modalScope.models.key, modalScope.models.value, modalScope.models.lang === '' ? undefined : modalScope.models.lang);
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
                    templateUrl: 'metadata-editor/oai_dc/add-dc-element.modal.html',
                    show: true
                });
            };

            $scope.$watch('metadataEditorViewForm.$pristine', function () {
                //TODO dereference properly
                if ($scope.metadataEditorViewForm && $scope.metadataEditorViewForm.$pristine === false) {
                    $scope.selectedMetadata.changed = true;
                }
            }, true);
		}
	]
);