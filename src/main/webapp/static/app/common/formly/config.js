'use strict';

angular.module('ortolangMarketApp')
    .config(['formlyConfigProvider', 'formlyApiCheck', function (formlyConfigProvider, formlyApiCheck) {
        formlyConfigProvider.setType([
            {
                name: 'dataobject',
                templateUrl: 'common/formly/ortolang-formly-file-select.html'
            },
            {
                name: 'number',
                template: '<input type="number" class="form-control" step="{{options.templateOptions.step !== undefined ? options.templateOptions.step : 1}}" ng-model="model[options.key]">',
                wrapper: ['bootstrapLabel', 'bootstrapHasError']
            },
            {
                name: 'preview',
                templateUrl: 'common/formly/tool-tpl-text-preview.html'
            },
            {
                name: 'multiField',
                templateUrl: 'common/formly/multi-field-template.html',
                defaultOptions: {
                    noFormControl: true
                },
                apiCheck: {
                    templateOptions: apiCheck.shape({
                        fields: apiCheck.arrayOf(formlyApiCheck.formlyFieldOptions)
                    })
                },
                controller: ['$scope', function($scope) {
                    var averageWidth = Math.floor(12 / $scope.to.fields.length);
                    $scope.colClass = [];
                    angular.forEach($scope.to.fields, function(field, index) {
                        var width = field.templateOptions.width || averageWidth;
                        $scope.colClass[index] = 'col-md-' + width + ' col-sm-' + width + ' col-xs-' + width;
                    });

                    // this is what formly-form does, but because we're not using formly-form, we have to do this ourselves.
                    $scope.$watch('model', function() {
                        angular.forEach($scope.to.fields, function(field) {
                            field.runExpressions && field.runExpressions() ;
                        });
                    }, true);
                }]
            }
        ]);
    }]);
