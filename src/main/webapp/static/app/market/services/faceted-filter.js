'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilter
 * @description
 * # FacetedFilter
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').provider('FacetedFilter', function () {

        // Constructor
        function FacetedFilter(config) {
            this.id = undefined;
            this.alias = undefined;
            this.value = undefined;
            this.label = undefined;
            this.type = 'string';
            this.resetLabel = '';
            this.selected = undefined;
            this.options = [];

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }

        // Methods
        FacetedFilter.prototype = {

            getId: function () {
                return this.id;
            },

            getAlias: function () {
                return this.alias;
            },

            setAlias: function(alias) {
                this.alias = alias;
            },

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

            getType: function () {
                return this.type;
            },

            setType: function(type) {
                this.type = type;
            },

            getSelected: function () {
                return this.selected;
            },

            setSelected: function(selected) {
                this.selected = selected;
            },

            getSelectedLabel: function() {
                return (this.selected)?this.selected.getLabel():this.resetLabel;
            },

            getResetLabel: function () {
                return this.resetLabel;
            },

            setResetLabel: function(resetLabel) {
                this.resetLabel = resetLabel;
            },

            getOptions: function () {
                return this.options;
            },

            setOptions: function(options) {
                this.options = options;
            },

            putOption: function(option) {
                var i = 0;
                for (i; i < this.options.length; i++) {
                    if (this.options[i].getValue() === option.getValue()) {
                        return;
                    }
                }
                this.options.push(option);
            },

            reset: function() {
                this.value = undefined;
                this.selected = undefined;
            }
        };

        this.make = function (config) {
            return new FacetedFilter(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };

    });