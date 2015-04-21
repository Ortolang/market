'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('FacetedFilterManager', [function () {

        // Constructor
        function FacetedFilterManager(config) {
            this.filters = [];

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }


        // Methods
        FacetedFilterManager.prototype = {

            getFilters: function() {
                return this.filters;
            },

            addFilter : function (filter) {
                var i = 0;
                for (i; i < this.filters.length; i++) {
                    if (this.filters[i].id === filter.id) {
                        return this.filters;
                    }
                }
                return this.filters.push(filter);
            },

            removeFilter: function(filter) {
                var i = 0;
                for (i; i < this.filters.length; i++) {
                    if (this.filters[i].id === filter.id) {
                        filter.reset();
                        delete this.filters[i];
                        return this.filters;
                    }
                }
            },

            resetFilter: function() {
                var i = 0;
                for (i; i < this.filters.length; i++) {
                    this.filters[i].reset();
                    delete this.filters[i];
                }
            }
        };

        this.make = function (config) {
            return new FacetedFilterManager(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };
    }]);
