'use strict';

/**
 * @ngdoc controller
 * @name ortolangVisualizers.controller:VideoVisualizerCtrl
 * @description
 * # VideoVisualizerCtrl
 */
angular.module('ortolangVisualizers')
    .controller('VideoVisualizerCtrl', ['$scope', function ($scope) {

        $scope.$on('modal.hide.before', function () {
            var videoElement;
            if ($scope.data.element.mimeType === 'video/x-flv') {
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
        if ($scope.data.element.mimeType === 'video/x-flv') {
            var flvPlayer = '<object type="application/x-shockwave-flash" data="vendor/player_flv_maxi.swf" width="640" height="480" class="flv-video-player">';
            flvPlayer += '<param name="movie" value="player_flv_maxi.swf" />';
            flvPlayer += '<param name="FlashVars" value="flv=' + $scope.data.element.downloadUrl + '&amp;margin=0&amp;showstop=1&amp;showvolume=1&amp;showtime=1&amp;showfullscreen=1" />';
            flvPlayer += '<param name="allowFullScreen" value="true" />';
            flvPlayer += '</object>';
            $scope.$on('modal.show', function () {
                angular.element(flvPlayer).appendTo('.video-visualizer-wrapper');
            });
        }
    }])
    .run(['VisualizerService', function (VisualizerService) {
        VisualizerService.register({
            id: 'video',
            templateUrl: 'visualizers/video/video-visualizer.html',
            data: ['element'],
            name: {
                fr: 'Lecteur video',
                en: 'Video player'
            },
            classes: {
                content: 'center middle'
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
    }]);

