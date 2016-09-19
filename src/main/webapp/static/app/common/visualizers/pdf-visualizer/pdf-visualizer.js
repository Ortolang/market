'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.pdfVisualizer
* @description
* # simpleImageVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('PdfVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'PdfVisualizer',
            name: {
                fr: 'Visualiseur de PDF',
                en: 'PDF Visualizer'
            },
            compatibleTypes: {
                'application/pdf': true
            }
        });

        VisualizerManagerProvider.$get().register(visualizer);

        visualizer.$get = function () {
            return visualizer;
        };

        return visualizer;
    }]);

/**
* @ngdoc directive
* @name ortolangVisualizers.directive:pdfVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('pdfVisualizer', ['Content', function (Content) {

        return {
            template: '<iframe class="pdf-visualizer-iframe" ng-src="{{pdfUrl}}"></iframe>',
            restrict: 'A',
            link: {
                pre: function (scope) {
                    angular.forEach(scope.elements, function (element) {
                        if (!element.downloadUrl) {
                            scope.pdfUrl = Content.getContentUrlWithKey(element.key);
                        }
                    });
                    scope.visualizer.header.fileName = scope.elements[0].name;
                    scope.visualizer.header.fileType = scope.elements[0].mimeType;
                }
            }
        };
    }]);
