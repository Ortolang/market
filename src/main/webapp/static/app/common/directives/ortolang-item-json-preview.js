'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ortolangItemJsonPreview
 * @description
 * # ortolangItemJsonPreview
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('ortolangItemJsonPreview', [function () {
        return {
            restrict: 'EA',
            scope: {
                content: '=',
                alias: '=',
                ortolangObject: '=',
                itemKey: '=',
                root: '=',
                tag: '=',
                tags: '=',
                browse: '=',
                icons: '=',
                preview: '@?'
            },
            controller: 'OrtolangItemJsonCtrl',
            template: '<div class="market-item-wrapper" ng-include="marketItemTemplate"></div>'
        };
    }]);

