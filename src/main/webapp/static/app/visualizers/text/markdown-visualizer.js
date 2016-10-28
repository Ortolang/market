'use strict';

/**
 * @ngdoc controller
 * @name ortolangVisualizers.controller:MarkdownVisualizerCtrl
 * @description
 * # MarkdownVisualizerCtrl
 */
angular.module('ortolangVisualizers')
    .controller('MarkdownVisualizerCtrl', ['$scope', 'Content', function ($scope, Content) {

        Content.downloadWithKey($scope.$ctrl.data.element.key).promise.then(function (response) {
            $scope.$ctrl.markdown = response.data;
        });
    }])
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'markdown',
            templateUrl: 'visualizers/text/markdown-visualizer.html',
            data: ['element'],
            name: {
                fr: 'Visualisateur de Markdown',
                en: 'Markdown Visualizer'
            },
            compatibleTypes: {
                'text/markdown': true,
                'text/x-markdown': true,
                'text/x-web-markdown': true
            }
        });
    }]);

