'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.ModycoVisualizer
* @description
* # ModycoVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('ModycoVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'ModycoVisualizer',
            name: 'Modyco Visualizer',
            compatibleTypes: [
                {
                    'audio/webm': true,
                    'audio/ogg': true,
                    'audio/vorbis': true,
                    'audio/mp3': true,
                    'audio/mpeg': true,
                    'video/mp4': true,
                    'video/ogg': true,
                    'video/webm': true,
                    'application/octet-stream': {webm: true}
                },
                {
                    'text/plain': true
                }
            ],
            acceptMultiple: true
        });

        VisualizerManagerProvider.$get().register(visualizer);

        visualizer.$get = function () {
            return visualizer;
        };

        return visualizer;
    }]);

/**
* @ngdoc directive
* @name ortolangVisualizers.directive:modycoVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('modycoVisualizer', [function () {

        return {
            templateUrl: 'common/visualizers/modyco-visualizer/modyco-visualizer.html',
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                angular.forEach(scope.elements, function (element) {
                    if (element.mimeType === 'text/plain') {
                        scope.transcription = element;
                    } else {
                        scope.audioVideo = element;
                    }
                });
            }
        };
    }]);

