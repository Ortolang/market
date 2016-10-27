'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ortolangItemJson
 * @description
 * # ortolangItemJson
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('ortolangItemJson', [function () {
        return {
            restrict: 'A',
            scope: {
                content: '=',
                alias: '=',
                ortolangObject: '=',
                itemKey: '=',
                wskey: '=',
                workspace: '=',
                root: '=',
                tag: '=',
                tags: '=',
                browse: '=?',
                icons: '=',
                preview: '@?',
                fromSearch: '=?'
            },
            controller: 'OrtolangItemJsonCtrl',
            templateUrl: function (elem, attr) {
                return 'common/directives/ortolang-item-json' + (!!attr.preview ? '-preview' : '') + '.html';
            }
        };
    }]);

