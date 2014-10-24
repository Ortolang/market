'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.VisualizerManager
 * @description
 * # VisualizerManager
 * Factory in the ortolangVisualizers.
 */
angular.module('ortolangVisualizers')
    .provider('VisualizerManager', [function () {

        var registry = [];

        // ---
        // PUBLIC METHODS.
        // ---

        this.getRegistry = function () {
            return registry;
        };

        this.register = function (visualizer) {
            console.info('Start registering visualizer \'' + visualizer.getName() + '\'');
            var i = 0;
            for (i; i < registry.length; i++) {
                if (registry[i].id === visualizer.id) {
                    return;
                }
            }
            console.info('Visualizer \'' + visualizer.getName() + '\' registered');
            return registry.push(visualizer);
        };

        this.getCompatibleVisualizers = function (mimeType, name) {
            var compatibleVisualizers = [];
            angular.forEach(registry, function (visualizer) {
                if (visualizer.isCompatible(mimeType, name)) {
                    this.push(visualizer);
                }
            }, compatibleVisualizers);
            return compatibleVisualizers;
        };

        this.getAllSupportedMimeTypes = function () {
            var allSupportedMimeTypes = {};
            angular.forEach(registry, function (visualizer) {
                angular.forEach(visualizer.compatibleTypes, function (value, key) {
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
            return allSupportedMimeTypes;
        };

        this.$get = function () {
            return {
                getRegistry: this.getRegistry,
                register: this.register,
                getCompatibleVisualizers: this.getCompatibleVisualizers,
                getAllSupportedMimeTypes: this.getAllSupportedMimeTypes
            };
        };

    }])
    .provider('VisualizerFactory', ['VisualizerManagerProvider', function (VisualizerManagerProvider) {

        // Constructor
        function OrtolangVisualizer(config) {
            this.id = undefined;
            this.name = undefined;
            this.description = undefined;
            this.compatibleTypes = undefined;
            this.needAllChildrenData = false;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);

            var elementName = config.id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            this.element = '<' + elementName + '></' + elementName + '>';
        }

        // Methods
        OrtolangVisualizer.prototype = {

            getId: function () {
                return this.id;
            },

            getName: function () {
                return this.name || this.id;
            },

            getDescription: function () {
                return this.description;
            },

            getCompatibleTypes: function () {
                return this.compatibleTypes;
            },

            getElement: function () {
                return this.element;
            },

            isCompatible: function (mimeType, name) {
                // If mimetype is given with an array of compatible file extensions
                if (angular.isObject(this.compatibleTypes[mimeType])) {
                    // check if the file extension is compatible
                    return this.compatibleTypes[mimeType][name.substr((~-name.lastIndexOf('.') >>> 0) + 2)] || false;
                }
                return this.compatibleTypes[mimeType] || false;
            }
        };

        this.make = function (config) {
            console.info('Start making visualizer \'' + config.name + '\'');
            if (!config.id || !config.compatibleTypes) {
                console.error('id and compatiblesTypes are mandatory', config);
                return undefined;
            }
            if (!config.id.match(/^[A-Z]/)) {
                console.error('id must start with an upper-case letter');
                return undefined;
            }
            return new OrtolangVisualizer(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };

    }])
    .run(function (VisualizerFactory) {
        // force VisualizerFactory to run by injecting it. Without this, VisualizerFactory only runs
        // when a controller or something else asks for it via DI.
    });
