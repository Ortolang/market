'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:filesModel
 * @description
 * # Directive of the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .directive('filesModel', [function () {
        return {
            restrict: 'A',
            scope: {
                filesModel: '='
            },
            link: function(scope, element) {
                element.bind('change', function(){
                    scope.$apply(function(){
                        scope.filesModel = element[0].files;
                    });
                });
            }
        };
    }]);
