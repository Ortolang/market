'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.VisualizerService
 * @description
 * # VisualizerService
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('VisualizerService', ['$modal', '$translate', 'ObjectResource', 'Content', 'Helper', function ($modal, $translate, ObjectResource, Content, Helper) {

        var service = this,
            registry = [];

        // Constructor
        function OrtolangVisualizer(config) {
            this.id = undefined;
            this.name = undefined;
            this.templateUrl = undefined;
            this.data = undefined;
            this.classes = undefined;
            this.compatibleTypes = undefined;
            this.acceptMultiple = false;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }

        function isCompatibleHelper(element, compatibleTypes) {
            // If mimetype is given with an array of compatible file extensions
            if (angular.isObject(compatibleTypes[element.mimeType])) {
                // check if the file extension is compatible
                return compatibleTypes[element.mimeType][element.name.substr((~-element.name.lastIndexOf('.') >>> 0) + 2)]; // jshint ignore:line
            }
            return compatibleTypes[element.mimeType];
        }

        // Methods
        OrtolangVisualizer.prototype = {

            getId: function () {
                return this.id;
            },

            getName: function () {
                return this.name[$translate.use()] || this.name.fr || this.id;
            },

            getCompatibleTypes: function () {
                return this.compatibleTypes;
            },

            isAcceptingSingle: function () {
                return !this.acceptMultiple;
            },

            isAcceptingMultiple: function () {
                return !!this.acceptMultiple;
            },

            isCompatible: function (elements) {
                if (elements.length === 1) {
                    return this.isAcceptingSingle() && isCompatibleHelper(elements[0], this.compatibleTypes);
                }
                if (this.isAcceptingMultiple() && elements.length === this.compatibleTypes.length) {
                    var compatibleTypesArray = angular.copy(this.compatibleTypes);
                    angular.forEach(elements, function (element) {
                        var j;
                        for (j = 0; j < compatibleTypesArray.length; j++) {
                            if (isCompatibleHelper(element, compatibleTypesArray[j])) {
                                compatibleTypesArray.splice(j, 1);
                                break;
                            }
                        }
                    }, this);
                    return compatibleTypesArray.length === 0;
                }
                return false;
            }
        };

        service.register = function (config) {
            if (!config.id || !config.templateUrl || !config.data || !config.compatibleTypes || !config.name  || !config.name.fr) {
                console.error('id, templateUrl, data, name and compatiblesTypes are mandatory', config);
                return;
            }
            if (!angular.isArray(config.data)) {
                console.error('data should be an array', config);
                return;
            }
            if (!angular.isObject(config.name)) {
                console.error('name should be an object', config);
                return;
            }
            var visualizer = new OrtolangVisualizer(config);
            var i = 0;
            for (i; i < registry.length; i++) {
                if (registry[i].id === visualizer.id) {
                    console.error('A visualizer with the id "%s" has already been registered', visualizer.getId());
                    return;
                }
            }
            registry.push(visualizer);
            return visualizer;
        };

        service.getCompatibleVisualizers = function (elements) {
            var compatibleVisualizers = [];
            angular.forEach(registry, function (visualizer) {
                if (visualizer.isCompatible(elements)) {
                    this.push(visualizer);
                }
            }, compatibleVisualizers);
            return compatibleVisualizers;
        };

        service.getAllSupportedMimeTypes = function () {
            var allSupportedMimeTypes = {};
            angular.forEach(registry, function (visualizer) {
                var compatibleTypesArray;
                if (visualizer.isAcceptingSingle()) {
                    compatibleTypesArray = [angular.copy(visualizer.getCompatibleTypes())];
                } else {
                    compatibleTypesArray = angular.copy(visualizer.getCompatibleTypes());
                }
                angular.forEach(compatibleTypesArray, function (compatibleTypes) {
                    angular.forEach(compatibleTypes, function (value, key) {
                        // if already supported by previous visualizers
                        if (allSupportedMimeTypes[key]) {
                            // if mime type compatibility restricted to given file extensions
                            if (angular.isObject(allSupportedMimeTypes[key])) {
                                // if value is an object we extend the list of compatible file extensions
                                if (angular.isObject(value)) {
                                    angular.extend(allSupportedMimeTypes[key], value);
                                } else if (value) {
                                    // else means that visualizer is compatible with any file extensions
                                    allSupportedMimeTypes[key] = value;
                                }
                            }
                        } else {
                            if (value) {
                                allSupportedMimeTypes[key] = value;
                            }
                        }
                    });
                });
            });
            return allSupportedMimeTypes;
        };

        // PREVIEW ACTIONS

        function preview(visualizer, object, url) {
            var modalScope = Helper.createModalScope(true);
            object.downloadUrl = url || Content.getContentUrlWithKey(object.key);
            modalScope.data = {
                element: object
            };
            modalScope.forceFullContent = true;
            modalScope.visualizer = visualizer;
            modalScope.$on('modal.show.before', function (event, modal) {
                modalScope.clickContent = function (event) {
                    if (angular.element(event.target).hasClass('close-on-click')) {
                        modal.hide();
                    }
                };
            });
            service.showModal(modalScope);
        }

        service.showModal = function (modalScope) {
            modalScope.$on('modal.show.before', function ($event, modal) {
                modalScope.click = function ($event) {
                    if (angular.element($event.target).hasClass('close-on-click')) {
                        modal.hide();
                    }
                };
            });
            // TODO handle pendingRequests
            modalScope.$on('modal.hide.before', function () {
                angular.forEach(modalScope.requests, function (request) {
                    if (request.promise.$$state && request.promise.$$state.pending) {
                        request.timeout.resolve();
                    }
                });
            });

            var visualizerModal = $modal({
                id: 'visualizer',
                scope: modalScope,
                template: '<visualizer class="modal close-on-click" data="data" visualizer="visualizer" actions="actions" hide="hide()" ng-click="click($event)"></visualizer>',
                show: true
            });

            modalScope.hide = function () {
                visualizerModal.hide();
            };
        };

        service.showPreview = function (key) {
            if (key !== undefined && key !== '') {
                ObjectResource.get({key: key}).$promise.then(function (data) {
                    service.showObjectPreview(data.object);
                });
            }
        };

        service.showObjectPreview = function (object, url) {
            var visualizers = service.getCompatibleVisualizers([object]);
            if (visualizers.length > 0) {
                preview(visualizers[0], object, url);
                return visualizers.length;
            }
            return visualizers.length;
        };

        service.getRegistry = function () {
            return registry;
        };

        return this;
    }]);
