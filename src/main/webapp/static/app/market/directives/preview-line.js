'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewLine
 * @description
 * # previewLine
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewLine', ['$window', 'ObjectResource', 'VisualizerManager', 'Content',  function ($window, ObjectResource, VisualizerManager, Content) {
        return {
            restrict: 'EA',
            templateUrl: 'market/directives/preview-line-template.html',
            scope: {
                collection: '=',
                paths: '='
            },
            link: {
                pre : function (scope) {

                    scope.openContentInNewTab  = function(key) {
                        var url = Content.getContentUrlWithKey(key);
                        $window.open(url, key);
                    };

                    function init() {
                        scope.previewFiles = [];
                        angular.forEach(scope.paths, function (path) {
                            ObjectResource.element({key: scope.collection, path: path}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                                scope.previewFiles.push({value: oobject, external: visualizers.length===0});
                            }, function (reason) {
                                console.error(reason);
                            });
                        });
                    }

                    init();
                }
            }
        };
    }]);
