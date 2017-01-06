'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:browserAsideInformation
 * @description
 * # browserAsideInformation
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('browserAsideInformation', {
        bindings: {
            elements: '<',
            element: '<',
            parent: '<',
            toggle: '&',
            showMetadata: '&',
            showSystemMetadata: '&',
            helper: '<'
        },
        controller: ['ObjectResource', 'Content', 'icons', 'ortolangType', function (ObjectResource, Content, icons, ortolangType) {

            var ctrl = this;

            this.Content = Content;
            this.icons = icons;

            this.elementsSize = function () {
                var i,
                    size = {
                        value: 0,
                        elementNumber: 0,
                        collectionNumber: 0,
                        partial: false
                    };
                if (this.elements) {
                    for (i = 0; i < this.elements.length; i++) {
                        if (this.elements[i].type === ortolangType.object) {
                            size.value += this.elements[i].size;
                            size.elementNumber += 1;
                        } else if (this.elements[i].type === ortolangType.collection) {
                            size.elementNumber += 1;
                            size.collectionNumber += 1;
                            size.partial = true;
                        }
                    }
                }
                return size;
            };

            this.$onChanges = function (changesObj) {
                if (changesObj.element) {
                    ctrl.computedSize = undefined;
                }
            };

            this.fetchCollectionSize = function () {
                var key;
                if (this.helper.hasOnlyParentSelected()) {
                    key = this.parent.key;
                } else if (this.element.type === ortolangType.collection) {
                    key = this.element.key;
                } else {
                    return;
                }
                ObjectResource.size({key: key}, function (data) {
                    ctrl.computedSize = data.size;
                });
            };
        }],
        templateUrl: 'browser/browser-aside-information.component.html'
    });
