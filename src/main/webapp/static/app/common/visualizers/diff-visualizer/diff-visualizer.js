'use strict';

/**
* @ngdoc service
* @name ortolangVisualizers.DiffVisualizer
* @description
* # DiffVisualizer
* Provider in the ortolangVisualizers.
*/
angular.module('ortolangVisualizers')
    .provider('DiffVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'DiffVisualizer',
            name: 'Diff Visualizer',
            compatibleTypes: [
                {
                    'text/plain': true
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
* @name ortolangVisualizers.directive:diffVisualizer
* @description
* # ortolangVisualizers
*/
angular.module('ortolangVisualizers')
    .directive('diffVisualizer', ['DownloadResource', function (DownloadResource) {

        return {
            templateUrl: 'common/visualizers/diff-visualizer/diff-visualizer.html',
            restrict: 'E',
            scope: true,
            link: function (scope, element, attrs) {
                scope.leftObjName = scope.elements[0].name;
                scope.rightObjName = scope.elements[1].name;

                DownloadResource.download({oKey: scope.elements[0].key}).success(function (data) {
                    scope.leftObj = data;
                });
                DownloadResource.download({oKey: scope.elements[1].key}).success(function (data) {
                    scope.rightObj = data;
                });

                scope.switchDiff = function () {
                    var tmp = scope.leftObj,
                        tmpBis = scope.leftObjName;
                    scope.leftObj = scope.rightObj;
                    scope.leftObjName = scope.rightObjName;
                    scope.rightObj = tmp;
                    scope.rightObjName = tmpBis;
                };
            }
        };
    }]);

