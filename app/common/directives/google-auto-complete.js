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
        function callback(scope, element, model) {
            var autocomplete = new google.maps.places.Autocomplete(element[0], scope.options);

            google.maps.event.addListener(autocomplete, 'place_changed',
                function () {
                    scope.$apply(function () {
                        model.$setViewValue(autocomplete.getPlace());
                    });
                });
        }

        return {
            restrict: 'A',
            scope: {
                options: '='
            },
            require : 'ngModel',
            link : function (scope, element, attrs, model) {
                if (angular.element('#google-maps-script').length === 0) {
                    console.log('Loading Google Maps library');
                    window.gminitialized = function () {
                        console.log('Google Maps library loaded');
                        callback(scope, element, model);
                    };
                    var script = document.createElement('script');
                    script.id = 'google-maps-script';
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=gminitialized';
                    document.body.appendChild(script);
                } else {
                    callback(scope, element, model);
                }
            }
        };
    });
