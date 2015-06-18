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
            name: {
                fr: 'Visualiseur de texte',
                en: 'Text Visualizer'
            },
            compatibleTypes: {
                'text/plain': true,
                'text/html': true,
                'text/x-php': true,
                'text/css': true,
                'text/xml': true,
                'text/x-log': true,
                'application/xml': true,
                'application/xhtml+xml': true,
                'application/rdf+xml': true,
                'application/xslt+xml': true,
                'text/javascript': true,
                'application/javascript': true,
                'text/x-web-markdown': true
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
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    var mimeType = scope.elements[0].mimeType,
                        limit = 20000;
                    if (mimeType === 'application/xml' || mimeType === 'application/rdf+xml' || mimeType === 'text/xml' || mimeType === 'application/xslt+xml') {
                        scope.language = 'xml';
                    } else if (mimeType === 'text/html' || mimeType === 'text/plain') {
                        scope.language = 'html';
                    } else if (mimeType === 'text/css') {
                        scope.language = 'css';
                    } else if (mimeType === 'text/x-php') {
                        scope.language = 'php';
                    } else if (mimeType === 'application/javascript' || mimeType === 'text/javascript') {
                        scope.language = 'javascript';
                    } else if (mimeType === 'text/x-web-markdown') {
                        scope.language = 'markdown';
                    } else {
                        scope.language = undefined;
                    }
                    scope.truncated = scope.forceFullData ? false : scope.elements[0].size >= limit;
                    scope.visualizer.header = {
                        fileName: scope.elements[0].name,
                        fileType: scope.elements[0].mimeType
                    };
                    scope.visualizer.footer = {
                        display: scope.truncated,
                        text: 'SIMPLE_TEXT_VISUALISER.EXCERPT'
                    };
                    scope.visualizer.footer.actions = [
                        {
                            name: 'seeMore',
                            text: 'SIMPLE_TEXT_VISUALISER.SEE_MORE'
                        }
                    ];
                    scope.doAction = function (name) {
                        if (name === 'seeMore') {
                            scope.seeMore();
                        }
                    };
                    DownloadResource.download({key: scope.elements[0].key}).success(function (data) {
                        if (!scope.forceFullData && scope.elements[0].size >= limit) {
                            scope.data = data.substr(0, limit);
                            scope.seeMore = function () {
                                if (scope.data.length + limit < scope.fullData.length) {
                                    scope.data = scope.fullData.substr(0, scope.data.length + limit);
                                } else {
                                    scope.data = scope.fullData;
                                    scope.fullData = undefined;
                                    scope.visualizer.footer.display = false;
                                }
                            };
                            scope.fullData = data;
                        } else {
                            scope.data = data;
                        }
                    }).error(function (error) {
                        console.error(error);
                    });
                }
            }
        };
    }]);

