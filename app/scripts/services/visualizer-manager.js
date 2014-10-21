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
            return registry.push(visualizer);
        };

        this.getCompatibleVisualizers = function (mimeType) {
            var compatibleVisualizers = [];
            angular.forEach(registry, function (visualizer) {
                if (visualizer.isCompatible(mimeType)) {
                    this.push(visualizer);
                }
            }, compatibleVisualizers);
            return compatibleVisualizers;
        };

        this.getAllSupportedMimeTypes = function () {
            var allSupportedMimeTypes = {};
            angular.forEach(registry, function (visualizer) {
                angular.extend(allSupportedMimeTypes, visualizer.compatibleTypes);
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
            this.element = undefined;
            this.needAllChildrenData = false;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
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

            isCompatible: function (mimeType) {
                return this.compatibleTypes[mimeType];
            }
        };

        this.make = function (config) {
            console.info('Start making visualizer \'' + config.name + '\'');
            var visualizer = new OrtolangVisualizer(config);
            console.info('Start registering visualizer \'' + visualizer.getName() + '\'');
            VisualizerManagerProvider.$get().register(visualizer);
            console.info('Visualizer \'' + visualizer.getName() + '\' registered');
            return visualizer;
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
