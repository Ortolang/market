'use strict';

angular.module('ortolangVisualizers')
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'image',
            templateUrl: 'visualizers/image/image-visualizer.html',
            data: ['element'],
            name: {
                fr: 'Visualiseur d\'image',
                en: 'Image Visualizer'
            },
            classes: {
                content: 'center'
            },
            compatibleTypes: {
                'image/jpg': true,
                'image/jpeg': true,
                'image/png': true,
                'image/gif': true,
                'image/svg+xml': true
            }
        });
    }]);
