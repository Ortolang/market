'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:toggleVisibility
 * @description
 * # toggleVisibility
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('toggleVisibility', function () {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                onaftersave: '&',
                profileData: '='
            },
            templateUrl: 'common/directives/toggle-visibility-template.html',

            link: function (scope) {

                scope.selectOption = function (option) {
                    scope.profileData.visibility = option;
                    scope.onaftersave(scope.profileData);
                };
            }
        };
    });
