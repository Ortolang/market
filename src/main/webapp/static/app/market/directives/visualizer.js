'use strict';

/**
 * @ngdoc directive
 * @name ortolangMarketApp.directive:visualizer
 * @description
 * # visualizer
 * Directive of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .directive('visualizer', ['$rootScope', '$compile', '$modal', 'ObjectResource', 'Content', 'VisualizerManager',  function ($rootScope, $compile, $modal, ObjectResource, Content, VisualizerManager) {
        return {
            restrict: 'EA',
            link: {
                pre : function (scope) {

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
                        modalScope.actions = {};
                        modalScope.doAction = function (name) {
                            if (modalScope.actions && modalScope.actions[name]) {
                                modalScope.actions[name]();
                            }
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

                    scope.showPreview = function (key) {
                        if (key !== undefined && key !== '') {

                            ObjectResource.get({key: key}).$promise.then(function (oobject) {
                                var visualizers = VisualizerManager.getCompatibleVisualizers([oobject.object]);

                                if (visualizers.length > 0) {
                                    finishPreview(visualizers[0], oobject);
                                }
                            });
                        }
                    };

                    scope.showPreview();
                }
            }
        };
    }]);
