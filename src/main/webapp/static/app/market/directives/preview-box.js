'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:previewBox
 * @description
 * # previewBox
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('previewBox', ['$rootScope', '$compile', '$modal', 'ObjectResource', 'VisualizerManager', 'Content',  function ($rootScope, $compile, $modal, ObjectResource, VisualizerManager, Content) {
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

                    scope.showPreview = function (preview) {
                        if (preview !== undefined && preview !== '') {

                            ObjectResource.get({key: preview}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                                if (visualizers.length > 0) {
                                    finishPreview(visualizers[0], oobject);
                                }
                            });
                        }
                    };

                    function finishPreview(visualizer, oobject) {
                        var element, modalScope, visualizerModal;
                        oobject.object.downloadUrl = Content.getContentUrlWithKey(oobject.object.key);
                        modalScope = $rootScope.$new();
                        modalScope.elements = [];
                        modalScope.elements.push(oobject.object);
                        modalScope.forceFullData = true;

                        element = $compile(visualizer.getElement())(modalScope);
                        element.addClass('close-on-click');

                        modalScope.visualizer = {
                            header: {},
                            content: {},
                            footer: {}
                        };
                        visualizerModal = $modal({
                            scope: modalScope,
                            template: 'common/visualizers/visualizer-template.html',
                            show: true
                        });
                        modalScope.$on('modal.show.before', function (event, modal) {
                            modal.$element.find('.visualizer-content').append(element);
                            modalScope.clickContent = function (event) {
                                if (angular.element(event.target).hasClass('close-on-click')) {
                                    visualizerModal.hide();
                                }
                            };
                        });
                    }

                    loadPreview(scope.key, scope.preview.paths);
                }
            }
        };
    }]);
