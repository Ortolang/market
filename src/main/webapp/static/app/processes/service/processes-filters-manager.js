'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ProcessesFiltersManager
 * @description
 * # ProcessesFiltersManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ProcessesFiltersManager', [function () {

            // Constructor
            function ProcessesFilter(config) {
                this.id = undefined;
                this.value = undefined;

                angular.forEach(config, function (value, key) {
                    if (this.hasOwnProperty(key)) {
                        this[key] = value;
                    }
                }, this);
            }

            // Methods
            ProcessesFilter.prototype = {

                getId: function () {
                    return this.id;
                },

                getValue: function () {
                    return this.value;
                },

                add: function (id,val) {
                    this.id = id;
                    this.value = val;
                }
            };

            // ---
            // MANAGER.
            // ---

            var filters = {};

            function getFilters() {
                return filters;
            }

            function addFilter(id, val){
                var filter = {};
                filter.id = id;
                filter.value = val;
                filters[id] = new ProcessesFilter(filter);
            }

            function removeFilter(id) {
                delete filters[id];
            }

            return {
                getFilters: getFilters,
                addFilter: addFilter,
                removeFilter: removeFilter
            };
        }]);
