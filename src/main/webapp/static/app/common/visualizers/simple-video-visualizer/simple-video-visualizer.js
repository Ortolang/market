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
            name: 'Simple Video Visualizer',
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
    .directive('simpleVideoVisualizer', ['Download', function (Download) {

        return {
            templateUrl: 'common/visualizers/simple-video-visualizer/simple-video-visualizer.html',
            restrict: 'E',
            scope: true,
            link: {
                pre: function (scope, element, attrs) {
                    angular.forEach(scope.elements, function (element) {
                        element.downloadUrl = Download.getDownloadUrl(element);
                    });
                },
                post: function (scope, element, attrs) {
                    angular.element('.visualizer-modal').on('hide.bs.modal', function () {
                        var simpleHtml5Video = angular.element('#simple-html5-video');
                        if (simpleHtml5Video.length === 1) {
                            simpleHtml5Video[0].pause();
                        }
                    });
                }
            }
        };
    }]);

