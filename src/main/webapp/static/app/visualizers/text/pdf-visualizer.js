'use strict';

angular.module('ortolangVisualizers')
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'pdf',
            templateUrl: 'visualizers/text/pdf-visualizer.html',
            data: ['element'],
            name: {
                fr: 'Visualiseur de PDF',
                en: 'PDF Visualizer'
            },
            compatibleTypes: {
                'application/pdf': true
            }
        });
    }]);
