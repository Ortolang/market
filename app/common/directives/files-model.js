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
                filesModel: '=',
                optionsKey: "="
            },
            link: function(scope, element) {
                element.on('change', function(){
                    scope.$apply(function(){
                        scope.filesModel[scope.optionsKey] = element[0].files[0];
                    });
                });
            }
        };
    }]);
