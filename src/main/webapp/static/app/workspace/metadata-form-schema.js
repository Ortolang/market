'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormSchemaCtrl
 * @description
 * # MetadataFormSchemaCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataFormSchemaCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.selectTab = function(tabName) {
            $scope.selectedTab = tabName;
        };

        $scope.submitMetadata = function (form, model) {
            // $scope.$broadcast('show-errors-check-validity');
            $scope.$broadcast('schemaFormValidate');

            if($scope.onlineTool===false) {
                delete model.toolHelp;
                delete model.toolId;
                delete model.toolUrl;
            }

            for(var propertyName in model) {
                if(model[propertyName].length===0) {
                    delete model[propertyName];
                } else if(model[propertyName].length===1 && model[propertyName][0]===undefined) {
                    delete model[propertyName];
                }
            }

            if (form.$invalid) {
                console.log('not ready');
                return;
            }

            var content = angular.toJson(model),
                contentType = 'text/json';

            $rootScope.$broadcast('metadata-editor-create', content, contentType);
        };

        var deregistration = $rootScope.$on('metadata-form-submit', function (event, model) {
            $scope.submitMetadata($scope.metadataMarketform, model);
        });

        $scope.$on('$destroy', function () {
            deregistration();
            // deregisterFolderSelectModal();
            // deregisterFileImageSelectModal();
            // deregisterFileLicenceSelectModal();
        });

    }]);