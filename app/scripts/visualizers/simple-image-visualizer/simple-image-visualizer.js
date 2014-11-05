'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.simpleImageVisualizer
* @description
* # simpleImageVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('SimpleImageVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleImageVisualizer',
            name: 'Simple Image Visualizer',
            compatibleTypes: {
                'image/jpg': true,
                'image/jpeg': true,
                'image/png': true,
                'image/gif': true
            },
            needAllChildrenData: true
        });

        VisualizerManagerProvider.$get().register(visualizer);

        visualizer.$get = function () {
            return visualizer;
        };

        return visualizer;
    }]);

/**
* @ngdoc directive
* @name ortolangVisualizers.directive:simpleImageVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('simpleImageVisualizer', [ '$filter', function ($filter) {

        return {
            templateUrl: '../../../views/simple-image-visualizer.html',
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                if ($filter('filter')(scope.children, {selected: true}, true).length === 0) {
                    scope.children[0].selected = true;
                }
                scope.imageElements = scope.children;
            }
        };
    }]);
