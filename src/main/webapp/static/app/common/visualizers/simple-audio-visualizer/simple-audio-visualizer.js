'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.SimpleAudioVisualizer
* @description
* # SimpleAudioVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('SimpleAudioVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleAudioVisualizer',
            name: 'Simple Audio Visualizer',
            compatibleTypes: {
                'audio/webm': true,
                'audio/ogg': true,
                'audio/vorbis': true,
                'audio/mp3': true,
                'audio/mpeg': true
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
    .directive('simpleAudioVisualizer', ['Download', function (Download) {

        return {
            templateUrl: 'common/visualizers/simple-audio-visualizer/simple-audio-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    angular.forEach(scope.elements, function (element) {
                        element.downloadUrl = Download.getDownloadUrl(element);
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

