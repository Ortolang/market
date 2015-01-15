'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ToolManager
 * @description
 * # ToolManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ToolManager', ['ToolsResource', function (ToolsResource) {

        var registry = [];

        // ---
        // ORTOLANG TOOL DEFINITION
        // ---

        // Constructor
        function OrtolangTool(config) {
            this.id = undefined;
            this.key = undefined;
            this.name = undefined;
            this.description = undefined;
            this.url = undefined;

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }

        // Methods
        OrtolangTool.prototype = {

            getId: function () {
                return this.id;
            },

            getName: function () {
                return this.name || this.id;
            },

            getDescription: function () {
                return this.description;
            },

            getUrl: function () {
                return this.url;
            }
        };

        // ---
        // MANAGER.
        // ---

        function getRegistry() {
            return registry;
        }

        function register(tool) {
            var i = 0;
            for (i; i < registry.length; i++) {
                if (registry[i].id === tool.getId()) {
                    console.error('A tool with the id "%s" has already been registered', tool.getId());
                    return;
                }
            }
            return registry.push(tool);
        }

        function getToolList() {
            ToolsResource.getToolsList(
                function (tools) {
                    angular.forEach(tools.entries, function (tool) {
                        console.log(new OrtolangTool(tool));
                        register(new OrtolangTool(tool));
                    });
                    console.log(registry);
                },
                function (error) {
                    console.error('An issue occured when trying to get the tool list: %o', error);
                }
            );
        }

        function init() {
            getToolList();
        }

        init();

        return {
            getRegistry: getRegistry
        };
    }]).run(['ToolManager', function (ToolManager) {
        // force ToolManager to run by injecting it. Without this, ToolManager only runs
        // when a controller or something else asks for it via DI.
    }]);
