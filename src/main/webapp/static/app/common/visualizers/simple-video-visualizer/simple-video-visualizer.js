'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.SimpleVideoVisualizer
 * @description
 * # SimpleVideoVisualizer
 * Provider in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('SimpleVideoVisualizer', ['VisualizerFactoryProvider', 'VisualizerManagerProvider', function (VisualizerFactoryProvider, VisualizerManagerProvider) {

        var visualizer = VisualizerFactoryProvider.$get().make({
            id: 'SimpleVideoVisualizer',
            name: {
                fr: 'Lecteur video',
                en: 'Video player'
            },
            compatibleTypes: {
                'video/mp4': true,
                'video/ogg': true,
                'video/webm': true,
                'video/quicktime': true,
                'video/theora': true,
                'video/x-flv': true,
                'video/x-m4v': true,
                'application/octet-stream': {webm: true}
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
 * @name ortolangVisualizers.directive:simpleVideoVisualizer
 * @description
 * # ortolangVisualizers
 */
angular.module('ortolangVisualizers')
    .directive('simpleVideoVisualizer', ['Content', function (Content) {

        return {
            templateUrl: 'common/visualizers/simple-video-visualizer/simple-video-visualizer.html',
            restrict: 'A',
            link: {
                pre: function (scope) {
                    angular.forEach(scope.elements, function (element) {
                        if (!element.downloadUrl) {
                            element.downloadUrl = Content.getContentUrlWithKey(element.key, false);
                        }
                    });
                    if (scope.elements) {
                        scope.visualizer.header.fileName = scope.elements[0].name;
                        scope.visualizer.header.fileType = scope.elements[0].mimeType;
                        scope.type = scope.elements[0].mimeType;
                    }
                    scope.visualizer.content.classes = 'center middle';
                    scope.$on('modal.hide.before', function () {
                        var videoElement;
                        if (scope.type === 'video/x-flv') {
                            videoElement = angular.element('.flv-video-player');
                            if (videoElement.length > 0) {
                                videoElement[0].SetVariable('player:jsStop', '');
                                videoElement[0].SetVariable('player:jsUrl', '');
                                videoElement.remove();
                            }
                        } else {
                            videoElement = angular.element('#simple-html5-video');
                            if (videoElement.length > 0) {
                                videoElement[0].pause();
                                videoElement.prop('src', '');
                                videoElement.remove();
                            }
                        }
                    });
                    if (scope.type === 'video/x-flv') {
                        var flvPlayer = '<object type="application/x-shockwave-flash" data="vendor/player_flv_maxi.swf" width="640" height="480" class="flv-video-player">';
                        flvPlayer += '<param name="movie" value="player_flv_maxi.swf" />';
                        flvPlayer += '<param name="FlashVars" value="flv=' + scope.elements[0].downloadUrl + '&amp;margin=0&amp;showstop=1&amp;showvolume=1&amp;showtime=1&amp;showfullscreen=1" />';
                        flvPlayer += '<param name="allowFullScreen" value="true" />';
                        flvPlayer += '</object>';
                        scope.$on('modal.show', function () {
                            angular.element(flvPlayer).appendTo('.video-visualizer-wrapper');
                        });
                    }
                }
            }
        };
    }]);

