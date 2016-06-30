'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewList
 * @description
 * # previewList
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewList', ['$window', 'ObjectResource', 'VisualizerManager', 'Content', 'icons',  function ($window, ObjectResource, VisualizerManager, Content, icons) {
        return {
            restrict: 'EA',
            templateUrl: 'market/directives/preview-list-template.html',
            scope: {
                collection: '=',
                paths: '='
            },
            link: {
                pre : function (scope) {

                    scope.openContentInNewTab  = function (key) {
                        var url = Content.getContentUrlWithKey(key);
                        $window.open(url, key);
                    };

                    (function init() {
                        scope.icons = icons;
                        scope.previewFiles = [];
                        angular.forEach(scope.paths, function (path) {
                            ObjectResource.element({key: scope.collection, path: path}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);
                                var thumbUrl = Content.getThumbUrlWithKey(oobject.key);
                                scope.previewFiles.push({key: oobject.key, thumbUrl: thumbUrl, mimeType: oobject.object.mimeType, external: visualizers.length === 0, name: oobject.object.name});
                            });
                        });
                    }());

                }
            }
        };
    }]);
