'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewLine
 * @description
 * # previewLine
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewLine', ['ObjectResource', 'VisualizerManager',  function (ObjectResource, VisualizerManager) {
        return {
            restrict: 'EA',
            templateUrl: 'market/directives/preview-line-template.html',
            scope: {
                collection: '=',
                paths: '='
            },
            link: {
                pre : function (scope) {

                    function init() {
                        scope.previewFiles = [];
                        angular.forEach(scope.paths, function (path) {
                            ObjectResource.element({key: scope.collection, path: path}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                                if (visualizers.length > 0) {
                                    scope.previewFiles.push(oobject);
                                }
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
