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
            // this.value = [];
            this.label = undefined;
            this.type = 'string';
            this.priority = 'low';
            this.resetLabel = '';
            this.selectedOptions = [];
            this.options = [];
            this.lock = false;
            this.lockOptions = false;
            this.view = 'checkbox-faceted-filter';

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

            // getValues: function () {
            //     return this.values;
            // },

            // setValues: function(values) {
            //     this.values = values;
            // },

            // isEmpty: function() {
            //     return this.values.length <= 0;
            // }

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

            getPriority: function () {
                return this.priority;
            },

            setPriority: function(priority) {
                this.priority = priority;
            },

            getSelectedOptions: function () {
                return this.selectedOptions;
            },

            setSelectedOptions: function(selectedOptions) {
                this.selectedOptions = selectedOptions;
            },

            hasSelectedOption: function(option) {
                var i = 0;
                for (i; i < this.selectedOptions.length; i++) {
                    if (this.selectedOptions[i].getValue() === option.getValue()) {
                        return true;
                    }
                }
                return false;
            },

            putSelectedOption: function(option) {
                if(!this.hasSelectedOption(option)) {
                    this.selectedOptions.push(option);
                }
            },

            removeSelectedOption: function(option) {
                var i = 0;
                for (i; i < this.selectedOptions.length; i++) {
                    if (this.selectedOptions[i].getValue() === option.getValue()) {
                        this.selectedOptions.splice(i, 1);
                        return;
                    }
                }
            },

            clearSelectedOptions: function () {
                return this.selectedOptions = [];
            },

            hasSelectedOptions: function() {
                return this.selectedOptions.length > 0;
            },            

            getSelectedOptionsValues: function () {
                var valueArr = [];
                angular.forEach(this.selectedOptions, function(opt) {
                    valueArr.push(opt.getValue());
                });
                return valueArr;
            },

            getSelectedLabel: function() {
                var label = '';
                angular.forEach(this.selectedOptions, function(opt) {
                    label += (label===''?'':',') + opt.getLabel();
                });
                return label===''?this.resetLabel:label;
            },

            getResetLabel: function () {
                return this.resetLabel;
            },

            setResetLabel: function(resetLabel) {
                this.resetLabel = resetLabel;
            },

            isLock: function() {
                return this.lock;
            },

            getView: function () {
                return this.view;
            },

            getOptions: function () {
                return this.options;
            },

            getOption: function(value) {
                var i = 0;
                for (i; i < this.options.length; i++) {
                    if (this.options[i].getValue() === value) {
                        return this.options[i];
                    }
                }
                return undefined;
            },

            setOptions: function(options) {
                if(!this.lockOptions) {
                    this.options = options;
                }
            },

            putOption: function(option) {
                if(!this.lockOptions) {
                    var i = 0;
                    for (i; i < this.options.length; i++) {
                        if (this.options[i].getValue() === option.getValue()) {
                            return;
                        }
                    }
                    this.options.push(option);
                }
            },

            clearOptions: function () {
                if(!this.lockOptions) {
                    return this.options = [];
                }
            },

            reset: function() {
                // this.value = undefined;
                this.selectedOptions = [];
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