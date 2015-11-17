'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewSlideshow
 * @description
 * # previewSlideshow
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewSlideshow', ['$window', '$timeout', 'ObjectResource', 'VisualizerManager', 'Content', 'icons',  function ($window, $timeout, ObjectResource, VisualizerManager, Content, icons) {
        return {
            restrict: 'EA',
            templateUrl: 'market/directives/preview-slideshow-template.html',
            scope: {
                collection: '=',
                paths: '='
            },
            link: {
                pre : function (scope) {
                    var INTERVAL = 5000, 
                        myTimeout;
                    
                    scope.openContentInNewTab  = function(key) {
                        var url = Content.getContentUrlWithKey(key);
                        $window.open(url, key);
                    };

                    scope.setCurrentSlideIndex = function (index) {
                        scope.currentIndex = index;
                    };

                    scope.isCurrentSlideIndex = function (index) {
                        return scope.currentIndex === index;
                    };

                    scope.prevSlide = function () {
                        scope.currentIndex = (scope.currentIndex > 0) ? --scope.currentIndex : scope.previewFiles.length - 1;
                        resetTimeout();
                    };

                    scope.nextSlide = function () {
                        scope.currentIndex = (scope.currentIndex < scope.previewFiles.length - 1) ? ++scope.currentIndex : 0;                        
                        resetTimeout();
                    };

                    function resetTimeout() {
                        stopTimeout();
                        startTimeout();
                    }

                    function startTimeout() {
                        myTimeout = $timeout(scope.nextSlide, INTERVAL);
                    }

                    function stopTimeout() {
                        $timeout.cancel(myTimeout);
                    }
                    
                    scope.openContentInNewTab  = function(key) {
                        var url = Content.getContentUrlWithKey(key);
                        $window.open(url, key);
                    };

                    scope.$on('$destroy', function () {
                        stopTimeout();
                    });

                    function init() {
                        scope.icons = icons;
                        scope.currentIndex = 0;
                        scope.previewFiles = [];
                        angular.forEach(scope.paths, function (path) {
                            ObjectResource.element({key: scope.collection, path: path}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);
                                var thumbUrl = Content.getPreviewUrlWithKey(oobject.key);
                                scope.previewFiles.push({key: oobject.key, thumbUrl: thumbUrl, mimeType: oobject.object.mimeType, external: visualizers.length===0});
                            }, function (reason) {
                                console.error(reason);
                            });
                        });

                        $timeout(scope.nextSlide, INTERVAL);
                    }

                    init();
                }
            }
        };
    }]);
