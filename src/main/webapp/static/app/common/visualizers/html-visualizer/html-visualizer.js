'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.HtmlVisualizer
* @description
* # HtmlVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('HtmlVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'HtmlVisualizer',
            name: {
                fr: 'Visualiseur HTML',
                en: 'HTML Visualizer'
            },
            compatibleTypes: {
                'text/html': true,
                'application/xhtml+xml': true,
                'application/xml': true
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
* @name ortolangVisualizers.directive:htmlVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('htmlVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/html-visualizer/html-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    scope.visualizer.header.fileName = scope.elements[0].name;
                    scope.visualizer.header.fileType = scope.elements[0].mimeType;
                    scope.pageSrc = Content.getContentUrlWithPath(scope.elements[0].path, scope.$parent.browserService.workspace.alias, scope.$parent.root, true);
                }
            }
        };
    }]);
