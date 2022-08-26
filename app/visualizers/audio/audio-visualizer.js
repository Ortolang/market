'use strict';

/**
 * @ngdoc controller
 * @name ortolangVisualizers.controller:AudioVisualizerCtrl
 * @description
 * # AudioVisualizerCtrl
 */
angular.module('ortolangVisualizers')
    .controller('AudioVisualizerCtrl', ['$scope', function ($scope) {

        $scope.$on('modal.hide.before', function () {
            var audioElement = angular.element('#simple-html5-audio');
            if (audioElement.length > 0) {
                audioElement[0].pause();
                audioElement.prop('src', '');
                audioElement.remove();
            }
        });
    }])
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'audio',
            templateUrl: 'visualizers/audio/audio-visualizer.html',
            data: ['element'],
            name: {
                fr: 'Lecteur audio',
                en: 'Audio player'
            },
            classes: {
                content: 'center middle'
            },
            compatibleTypes: {
                'audio/webm': true,
                'audio/ogg': true,
                'audio/vorbis': true,
                'audio/mp3': true,
                'audio/mpeg': true,
                'audio/x-wav': true
            }
        });
    }]);

