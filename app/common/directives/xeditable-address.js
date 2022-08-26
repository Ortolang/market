'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:editableAddress
 * @description
 * # editableAddress
 * Directive of the ortolangMarketApp
 */
angular.module('xeditable').directive('editableAddress', ['editableDirectiveFactory',
    function (editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableAddress',
            inputTpl: '<input class="form-control" type="text" google-auto-complete />'
        });
    }]);
