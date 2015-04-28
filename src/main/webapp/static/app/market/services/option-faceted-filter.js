'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.OptionFacetedFilter
 * @description
 * # OptionFacetedFilter
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').provider('OptionFacetedFilter', function () {

        // Constructor
        function OptionFacetedFilter(config) {
            this.value = undefined;
            this.label = undefined;
            this.length = 0;
            this.subFilters = [];

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }

        // Methods
        OptionFacetedFilter.prototype = {

            getValue: function () {
                return this.value;
            },

            setValue: function(value) {
                this.value = value;
            },

            getLabel: function () {
                return this.label;
            },

            setLabel: function(label) {
                this.label = label;
            },

            getSubFilters: function () {
                return this.subFilters;
            },

            setSubFilters: function(subFilters) {
                this.subFilters = subFilters;
            },

            putSubFilter: function(subFilter) {
                this.subFilters.push(subFilter);
            },

            getLength: function () {
                return this.length;
            },

            incrementLength: function() {
                this.length++;
            },

            reset: function() {
                this.length = 0;
            }
        };

        this.make = function (config) {
            return new OptionFacetedFilter(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };

    });