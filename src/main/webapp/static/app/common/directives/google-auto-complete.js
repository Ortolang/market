'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:googleAutoComplete
 * @description
 * # googleAutoComplete
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('googleAutoComplete', function () {
        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            require : 'ngModel',
            link : function (scope, element, attrs, model) {
                var autocomplete = new google.maps.places.Autocomplete(element[0], scope.options);

                google.maps.event.addListener(autocomplete, 'place_changed',
                    function () {
                        scope.$apply(function () {
                            model.$setViewValue(autocomplete.getPlace());
                        });
                    });
            }
        };
    });
