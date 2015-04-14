'use strict';

/**
 * @ngdoc function
 * @name ortolangMarketApp.controller:MetadataFormSchemaCtrl
 * @description
 * # MetadataFormSchemaCtrl
 * Controller of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .controller('MetadataFormSchemaCtrl', ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
        $scope.selectTab = function(tabName) {
            $scope.selectedTab = tabName;
        };

        $scope.submitMetadata = function (form, model) {
            // $scope.$broadcast('show-errors-check-validity');
            $scope.$broadcast('schemaFormValidate');

            if (form.$invalid) {
                console.log('not ready');
                return;
            }

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

            var content = angular.toJson(model),
                contentType = 'text/json';

            $rootScope.$broadcast('metadata-editor-create', content, contentType);
        };

        var deregistration = $rootScope.$on('metadata-form-submit', function (event, model) {
            $scope.submitMetadata($scope.metadataMarketform, model);
        });

        var deregistrationSchemaRendered = $rootScope.$on('sf-render-finished', function (event, schema) {
            console.log("render finished");
            resizeMetadataPanel();
        });
        // *********************** //
        //          Resize         //
        // *********************** //

        function resizeMetadataPanel() {
            console.log("resizeMetadataPanel");
            var topOffset = 53,
                bottomOffset = 51,
                toolbar = 55 + 20,
                blockquote = 70 + 20,
                hr = 1 + 20,
                height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

            height = height - topOffset - bottomOffset - toolbar - blockquote - hr;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                
                $('.metadata-form-panel').css('height', height + 'px');
            }
        }

        $scope.$on('$destroy', function () {
            deregistration();
            deregistrationSchemaRendered();
        });

        angular.element($window).bind('load resize', function () {
            resizeMetadataPanel();
        });

    }]);