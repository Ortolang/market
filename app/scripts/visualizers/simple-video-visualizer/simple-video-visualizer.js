'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.SimpleVideoVisualizer
 * @description
 * # SimpleVideoVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('SimpleVideoVisualizer', ['VisualizerFactoryProvider', function (VisualizerFactoryProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleVideoVisualizer',
            name: 'Simple Video Visualizer',
            compatibleTypes: {
                'video/mp4': true,
                'video/ogg': true,
                'video/webm': true,
                'application/octet-stream': ['webm']
            },
            element: '<simple-video-visualizer></simple-video-visualizer>'
        });

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
    .directive('simpleVideoVisualizer', [function () {

        return {
            templateUrl: '../../../views/simple-video-visualizer.html',
            restrict: 'E',
            scope: true
        };
    }]);

