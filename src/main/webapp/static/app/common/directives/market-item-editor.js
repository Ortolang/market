'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:marketItemEditor
 * @description
 * # marketItemEditor
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('marketItemEditor', ['$rootScope', '$filter', '$location', 'ObjectResource', 'Settings', 'Content', 'icons', '$translate', function ($rootScope, $filter, $location, ObjectResource, Settings, Content, icons, $translate) {
        return {
            restrict: 'EA',
            templateUrl: 'common/directives/market-item-editor.html',
            link: {
                pre: function (scope) {

                       // init();
                }
            }
        };
    }]);