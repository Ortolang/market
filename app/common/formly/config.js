'use strict';

angular.module('ortolangMarketApp')
    .config(['formlyTemplateProvider', 'formlyOptionsProvider', function (formlyTemplateProvider, formlyOptionsProvider) {
        formlyTemplateProvider.setTemplateUrl('select', 'common/formly/ortolang-formly-select.html');
        formlyTemplateProvider.setTemplateUrl('dataobject', 'common/formly/ortolang-formly-file-select.html');
        formlyTemplateProvider.setTemplateUrl('label', 'common/formly/ortolang-formly-label.html');
        formlyTemplateProvider.setTemplateUrl('number', 'common/formly/ortolang-formly-decimal.html');
        formlyOptionsProvider.setOption({
            submitButtonTemplate: '<button class="btn btn-success" type="submit" ng-show="!options.hideSubmit">{{options.submitCopy || "SUBMIT" | translate}}</button>'
        });
    }]);
