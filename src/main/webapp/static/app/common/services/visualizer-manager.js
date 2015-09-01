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
            if (!visualizer.id) {
                return;
            }
            var i = 0;
            for (i; i < registry.length; i++) {
                if (registry[i].id === visualizer.id) {
                    console.error('A visualizer with the id "%s" has already been registered', visualizer.getId());
                    return;
                }
            }
            return registry.push(visualizer);
        };

        this.getCompatibleVisualizers = function (elements) {
            var compatibleVisualizers = [];
            angular.forEach(registry, function (visualizer) {
                if (visualizer.isCompatible(elements)) {
                    this.push(visualizer);
                }
            }, compatibleVisualizers);
            return compatibleVisualizers;
        };

        this.getAllSupportedMimeTypes = function () {
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

        this.$get = function () {
            return {
                getRegistry: this.getRegistry,
                register: this.register,
                getCompatibleVisualizers: this.getCompatibleVisualizers,
                getAllSupportedMimeTypes: this.getAllSupportedMimeTypes
            };
        };

    }])
    .provider('VisualizerFactory', ['$translateProvider', function ($translateProvider) {

        var language = 'fr';

        // Constructor
        function OrtolangVisualizer(config) {
            this.id = undefined;
            this.name = undefined;
            this.description = undefined;
            this.compatibleTypes = undefined;
            this.needAllChildrenData = false;
            this.acceptMultiple = false;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);

            var elementName = config.id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            this.element = '<div ng-hide="pendingData" class="visualizer" ' + elementName + '></div>';
        }

        // Methods
        OrtolangVisualizer.prototype = {

            getId: function () {
                return this.id;
            },

            getName: function () {
                language = $translateProvider.use() || language;
                return this.name[language] || this.name.fr || this.id;
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

            isAcceptingSingle: function () {
                return !this.acceptMultiple;
            },

            isAcceptingMultiple: function () {
                return !!this.acceptMultiple;
            },

            isCompatibleHelper: function (element, _compatibleTypes_) {
                var compatibleTypes = _compatibleTypes_ || this.compatibleTypes;
                // If mimetype is given with an array of compatible file extensions
                if (angular.isObject(compatibleTypes[element.mimeType])) {
                    // check if the file extension is compatible
                    return compatibleTypes[element.mimeType][element.name.substr((~-element.name.lastIndexOf('.') >>> 0) + 2)];
                }
                return compatibleTypes[element.mimeType];
            },

            isCompatible: function (elements) {
                if (elements.length === 1) {
                    return this.isAcceptingSingle() && this.isCompatibleHelper(elements[0]);
                }
                if (this.isAcceptingMultiple() && elements.length === this.compatibleTypes.length) {
                    var compatibleTypesArray = angular.copy(this.compatibleTypes);
                    angular.forEach(elements, function (element) {
                        var j;
                        for (j = 0; j < compatibleTypesArray.length; j++) {
                            if (this.isCompatibleHelper(element, compatibleTypesArray[j])) {
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

        this.make = function (config) {
            if (!config.id || !config.compatibleTypes || !config.name  || !config.name.fr) {
                console.error('id, name and compatiblesTypes are mandatory', config);
                return {};
            }
            if (!config.id.match(/^[A-Z]/)) {
                console.error('id must start with an upper-case letter', config.id);
                return {};
            }
            return new OrtolangVisualizer(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };

    }]);
