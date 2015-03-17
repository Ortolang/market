'use strict';

angular.module('ortolangMarketApp')
    .config(['formlyConfigProvider', function (formlyConfigProvider) {
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
            }
        ]);
    }]);
