'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewBox
 * @description
 * # previewBox
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewBox', ['ObjectResource', 'VisualizerManager',  function (ObjectResource, VisualizerManager) {
        return {
            restrict: 'EA',
            scope: {
                preview: '=',
                key: '=',
                alias: '=',
                root: '='
            },
            templateUrl: 'market/directives/preview-box.html',
            link: {
                pre : function (scope) {

                    function loadPreview(paths) {
                        angular.forEach(paths, function (path) {

                            if(path.substr(path.lastIndexOf('/')+1).toLowerCase() === 'index.html') {
                                scope.path = path;
                                scope.preview.type = 'url';
                            }

                        });
                    }

                    loadPreview(scope.preview.paths);
                }
            }
        };
    }]);
