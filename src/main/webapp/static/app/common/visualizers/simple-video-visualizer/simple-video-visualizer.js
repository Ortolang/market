'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.SimpleVideoVisualizer
 * @description
 * # SimpleVideoVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('SimpleVideoVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleVideoVisualizer',
            name: {
                fr: 'Lecteur video',
                en: 'Video player'
            },
            compatibleTypes: {
                'video/mp4': true,
                'video/ogg': true,
                'video/webm': true,
                'video/quicktime': true,
                'video/theora': true,
                'application/octet-stream': {webm: true}
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
 * @name ortolangVisualizers.directive:simpleVideoVisualizer
 * @description
 * # ortolangVisualizers
 */
angular.module('ortolangVisualizers')
    .directive('simpleVideoVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/simple-video-visualizer/simple-video-visualizer.html',
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
                    scope.visualizer.content.classes = 'center middle';
                }
            }
        };
    }]);

