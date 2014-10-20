'use strict';

///**
//* @ngdoc service
//* @name ortolangVisualizers.simpleImageVisualizer
//* @description
//* # simpleImageVisualizer
//* Provider in the ortolangVisualizers.
//*/
//angular.module('ortolangVisualizers')
//    .factory('SimpleImageVisualizer', ['VisualizerFactory', function (VisualizerFactory) {
//
//        var visualizer = VisualizerFactory.make({
//            id: 'SimpleImageVisualizer',
//            name: 'Simple Image Visualizer',
//            compatibleTypes: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'],
//            element: '<simple-image-visualizer></simple-image-visualizer>',
//            needAllChildrenData: true
//        });
//
//        return visualizer;
//
//    }]).run(function (SimpleImageVisualizer) {
//        console.debug('RUN SimpleImageVisualizer', SimpleImageVisualizer);
//    });

/**
* @ngdoc service
* @name ortolangVisualizers.simpleImageVisualizer
* @description
* # simpleImageVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('SimpleImageVisualizer', ['VisualizerFactoryProvider', function (VisualizerFactoryProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleImageVisualizer',
            name: 'Simple Image Visualizer',
            compatibleTypes: {
                'image/jpg': true,
                'image/jpeg': true,
                'image/png': true,
                'image/gif': true
            },
            element: '<simple-image-visualizer></simple-image-visualizer>',
            needAllChildrenData: true
        });

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
    .directive('simpleImageVisualizer', [ 'SimpleImageVisualizer', function (SimpleImageVisualizer) {

        return {
            templateUrl: '../../../views/simple-image-visualizer.html',
            restrict: 'E',
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.imageElements = [];
                angular.forEach(scope.children, function (child) {
                    if (SimpleImageVisualizer.isCompatible(child.mimetype)) {
                        scope.imageElements.push(child);
                    }
                });
            }
        };
    }]);