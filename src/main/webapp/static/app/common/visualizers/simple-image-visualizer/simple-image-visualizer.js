'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.simpleImageVisualizer
* @description
* # simpleImageVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('SimpleImageVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleImageVisualizer',
            name: {
                fr: 'Visualiseur d\'image',
                en: 'Image Visualizer'
            },
            compatibleTypes: {
                'image/jpg': true,
                'image/jpeg': true,
                'image/png': true,
                'image/gif': true,
                'image/svg+xml': true
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
* @name ortolangVisualizers.directive:simpleImageVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('simpleImageVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/simple-image-visualizer/simple-image-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope) {
                    scope.elements[0].selected = true;
                    scope.imageElements = [];
                    angular.forEach(scope.elements, function (element) {
                        if (!element.downloadUrl) {
                            element.downloadUrl = Content.getContentUrlWithKey(element.key);
                        }
                        scope.imageElements.push(element);
                    });
                    scope.visualizer.header.fileName = scope.imageElements[0].name;
                    scope.visualizer.header.fileType = scope.imageElements[0].mimeType;
                    scope.visualizer.content.classes = 'center';
                }
            }
        };
    }]);
