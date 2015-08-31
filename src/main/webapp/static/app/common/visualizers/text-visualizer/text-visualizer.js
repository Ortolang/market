'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.TextVisualizer
 * @description
 * # TextVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('TextVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'TextVisualizer',
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
                'application/json': true,
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
 * @name ortolangVisualizers.directive:textVisualizer
 * @description
 * # ortolangVisualizers
 */
angular.module('ortolangVisualizers')
    .directive('textVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/text-visualizer/text-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope, element, attrs) {
                    var mimeType = scope.elements[0].mimeType,
                        limit = 20000;
                    scope.hasPreview = false;
                    if (mimeType === 'application/xml' || mimeType === 'application/rdf+xml' || mimeType === 'text/xml' || mimeType === 'application/xslt+xml') {
                        scope.language = 'xml';
                    } else if (mimeType === 'text/html' || mimeType === 'text/plain') {
                        scope.language = 'html';
                    } else if (mimeType === 'text/css') {
                        scope.language = 'css';
                    } else if (mimeType === 'text/x-php') {
                        scope.language = 'php';
                    } else if (mimeType === 'application/javascript' || mimeType === 'text/javascript' || mimeType === 'application/json') {
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
                        text: 'TEXT_VISUALIZER.EXCERPT'
                    };
                    scope.visualizer.footer.actions = [
                        {
                            name: 'seeMore',
                            text: 'TEXT_VISUALIZER.SEE_MORE'
                        }
                    ];
                    scope.doAction = function (name) {
                        if (name === 'seeMore') {
                            scope.seeMore();
                        }
                    };
                    Content.downloadWithKey(scope.elements[0].key).success(function (data) {
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
                        if (mimeType === 'text/html' || mimeType === 'application/xhtml+xml' ||
                            (mimeType === 'application/xml' && data.indexOf('tei-boilerplate') !== -1)) {
                            scope.hasPreview = true;
                            scope.tabs = {};
                            scope.tabs.activeTab = 'preview';
                            scope.visualizer.header.actions = [
                                {
                                    name: 'showSource',
                                    hide: function () {
                                        return scope.tabs.activeTab === 'source';
                                    },
                                    text: 'TEXT_VISUALIZER.SHOW_SOURCE'
                                },
                                {
                                    name: 'showPreview',
                                    hide: function () {
                                        return scope.tabs.activeTab === 'preview';
                                    },
                                    text: 'TEXT_VISUALIZER.SHOW_PREVIEW'
                                }
                            ];
                            scope.doAction = function (name) {
                                if (name === 'showSource') {
                                    scope.tabs.activeTab = 'source';
                                } else if (name === 'showPreview') {
                                    scope.tabs.activeTab = 'preview';
                                }
                            };
                            scope.pageSrc = Content.getContentUrlWithPath(scope.elements[0].path, scope.$parent.browserService.workspace.alias, scope.$parent.root);
                        }
                        scope.dataReceived = true;
                    }).error(function (error) {
                        console.error(error);
                    });
                }
            }
        };
    }]);

