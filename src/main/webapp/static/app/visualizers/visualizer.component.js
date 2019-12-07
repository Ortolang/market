'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:visualizer
 * @description
 * # visualizer
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('visualizer', {
        bindings: {
            data: '<',
            visualizer: '<',
            hide: '&',
            actions: '<'
        },
        controller: ['Content', 'icons', function (Content, icons) {
            var ctrl = this;

            ctrl.$onInit = function () {

                if (angular.isUndefined(ctrl.visualizer)) {
                    ctrl.visualizer = {
                        templateUrl: 'visualizers/no-visualizer.template.html',
                        classes: { content: 'center' }
                    };
                }

                ctrl.icons = icons;

                ctrl.header = {};
                ctrl.content = {};
                ctrl.footer = {};

                ctrl.requests = [];

                if (angular.isUndefined(ctrl.actions)) {
                    ctrl.actions = {};
                }

                if (ctrl.data) {
                    if (ctrl.data.element) {
                        if (angular.isUndefined(ctrl.data.element.downloadUrl)) {
                            ctrl.data.element.downloadUrl = Content.getContentUrlWithKey(ctrl.data.element.key);
                        }
                        ctrl.header.fileName = ctrl.data.element.name;
                        ctrl.header.fileType = ctrl.data.element.mimeType;
                    }
                    if (ctrl.data.elements) {
                        angular.forEach(ctrl.data.elements, function (element) {
                            element.downloadUrl = Content.getContentUrlWithKey(element.key);
                        });
                    }
                }

                ctrl.doAction = function (name) {
                    if (ctrl.actions && ctrl.actions[name]) {
                        ctrl.actions[name]();
                    }
                };
            };
        }],
        templateUrl: 'visualizers/visualizer.component.html'
    });
