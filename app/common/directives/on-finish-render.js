'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:holderJs
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('onFinishRender', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatRenderingFinished');
                    });
                }
            }
        };
    }]);
