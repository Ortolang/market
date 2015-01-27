'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.SimpleTextVisualizer
 * @description
 * # SimpleTextVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('SimpleTextVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleTextVisualizer',
            name: 'Simple Text Visualizer',
            compatibleTypes: {
                'text/plain': true,
                'text/html': true,
                'text/x-php': true,
                'text/css': true,
                'text/xml': true,
                'application/xml': true,
                'application/rdf+xml': true,
                'text/javascript': true,
                'application/javascript': true
            }
        });

        VisualizerManagerProvider.$get().register(visualizer);

        this.$get = function () {
            return visualizer;
        };
    }]);

/**
 * @ngdoc directive
 * @name ortolangVisualizers.directive:simpleTextVisualizer
 * @description
 * # ortolangVisualizers
 */
angular.module('ortolangVisualizers')
    .directive('simpleTextVisualizer', ['DownloadResource', '$window', function (DownloadResource, $window) {

        return {
            templateUrl: 'common/visualizers/simple-text-visualizer/simple-text-visualizer.html',
            restrict: 'E',
            scope: true,
            link: {
                pre: function (scope, element, attrs) {
                    var mimeType = scope.elements[0].mimeType;
                    if (mimeType === 'application/xml' || mimeType === 'application/rdf+xml' || mimeType === 'text/xml') {
                        scope.language = 'xml';
                    } else if (mimeType === 'text/html') {
                        scope.language = 'html';
                    } else if (mimeType === 'text/css') {
                        scope.language = 'css';
                    } else if (mimeType === 'text/x-php') {
                        scope.language = 'php';
                    } else if (mimeType === 'application/javascript' || mimeType === 'text/javascript') {
                        scope.language = 'javascript';
                    } else {
                        scope.language = undefined;
                    }
                    scope.highlight = true;
                    DownloadResource.download({oKey: scope.elements[0].key}).success(function (data) {
                        if (scope.elements[0].size >= 20000) {
                            scope.data = data.substr(0, 20000);
                            scope.seeFullData = function () {
                                scope.data = scope.fullData;
                            };
                            scope.fullData = data;
                        } else {
                            scope.data = data;
                        }
                    }).error(function (error) {
                        console.error(error);
                    });
                },
                post: function () {
                    var height = $window.innerHeight - 4 * parseInt(angular.element('.modal-dialog.modal-lg').css('margin-top'), 10);
                    angular.element('.highlight').css('height', height);
                }
            }
        };
    }]);

