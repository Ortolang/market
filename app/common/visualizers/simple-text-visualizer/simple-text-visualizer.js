'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.SimpleTextVisualizer
 * @description
 * # SimpleTextVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('SimpleTextVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleTextVisualizer',
            name: 'Simple Text Visualizer',
            compatibleTypes: {
                'text/plain': true,
                'text/html': true,
                'text/css': true,
                'text/xml': true,
                'application/xml': true,
                'application/rdf+xml': true,
                'text/javascript': true,
                'application/javascript': true
            }
        });

        VisualizerManagerProvider.$get().register(visualizer);

        this.$get = function () {
            return visualizer;
        };
    }]);

/**
 * @ngdoc directive
 * @name ortolangVisualizers.directive:simpleTextVisualizer
 * @description
 * # ortolangVisualizers
 */
angular.module('ortolangVisualizers')
    .directive('simpleTextVisualizer', ['DownloadResource', function (DownloadResource) {

        return {
            templateUrl: 'common/visualizers/simple-text-visualizer/simple-text-visualizer.html',
            restrict: 'E',
            scope: true
        };
    }]);

