'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:ngRightClick
 * @description
 * # The ngRightClick directive allows you to specify custom behavior when an element is right clicked.
 */
angular.module('ortolangMarketApp')
    .directive('ngRightClick', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var fn = $parse(attrs.ngRightClick);
                element.bind('contextmenu', function (event) {
                    scope.$apply(function () {
                        event.preventDefault();
                        fn(scope, {$event: event});
                    });
                });
            }
        };
    });
