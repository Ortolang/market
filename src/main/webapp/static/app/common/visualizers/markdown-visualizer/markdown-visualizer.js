'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.MarkdownVisualizer
* @description
* # MarkdownVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('MarkdownVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'MarkdownVisualizer',
            name: {
                fr: 'Visualisateur de Markdown',
                en: 'Markdown Visualizer'
            },
            compatibleTypes: {
                'text/markdown': true,
                'text/x-markdown': true,
                'text/x-web-markdown': true
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
* @name ortolangVisualizers.directive:simpleAudioVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('markdownVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/markdown-visualizer/markdown-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    angular.forEach(scope.elements, function (element) {
                        element.downloadUrl = Content.getContentUrlWithKey(element.key);
                    });
                    if (scope.elements) {
                        scope.visualizer.header.fileName = scope.elements[0].name;
                        scope.visualizer.header.fileType = scope.elements[0].mimeType;
                    }
                }
            }
        };
    }]);

