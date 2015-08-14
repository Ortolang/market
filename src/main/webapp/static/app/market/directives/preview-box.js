'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewBox
 * @description
 * # previewBox
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewBox', ['ObjectResource',  function (ObjectResource) {
        return {
            restrict: 'EA',
            scope: {
                preview: '=',
                key: '='
            },
            templateUrl: 'market/directives/preview-box.html',
            link: {
                pre : function (scope) {

                    function loadPreview(collection, paths) {
                        scope.previewFiles = [];
                        angular.forEach(paths, function (path) {
                            ObjectResource.element({key: collection, path: path}).$promise.then(function (oobject) {
                                scope.previewFiles.push(oobject);
                            }, function (reason) {
                                console.error(reason);
                            });
                        });
                    }

                    loadPreview(scope.key, scope.preview.paths);
                }
            }
        };
    }]);
