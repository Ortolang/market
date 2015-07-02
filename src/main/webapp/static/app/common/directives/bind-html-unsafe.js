'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:bindHtmlUnsafe
 * @description
 * # bindHtmlUnsafe
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('bindHtmlUnsafe', ['$compile', function ($compile) {
        return function( $scope, $element, $attrs ) {

            var compile = function( newHTML ) {
                newHTML = $compile(newHTML)($scope);
                $element.html('').append(newHTML);
            };

            var htmlName = $attrs.bindHtmlUnsafe;

            $scope.$watch(htmlName, function( newHTML ) {
                if(!newHTML) {
                    return;
                }
                compile(newHTML);
            });

        };
    }]);
