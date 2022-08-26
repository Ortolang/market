'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilter
 * @description
 * # FacetedFilter
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').service('FacetedFilter', ['$filter', 'OptionFacetedFilter', function ($filter, OptionFacetedFilter) {

    // Constructor
    function FacetedFilter(config) {
        this.id = undefined;
        this.path = undefined;
        this.alias = undefined;
        this.label = undefined;
        this.type = 'string';
        this.priority = 'low';
        this.visibility = true;
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

        getPath: function () {
            return this.path;
        },

        getAlias: function () {
            return this.alias;
        },

        setAlias: function (alias) {
            this.alias = alias;
        },

        setLabel: function (label) {
            this.label = label;
        },

        getType: function () {
            return this.type;
        },

        setType: function (type) {
            this.type = type;
        },

        getPriority: function () {
            return this.priority;
        },

        setPriority: function (priority) {
            this.priority = priority;
        },

        isVisible: function () {
            return this.visibility;
        },

        setVisibility: function (visibility) {
            this.visibility = visibility;
        },

        getSelectedOptions: function () {
            return this.selectedOptions;
        },

        setSelectedOptions: function (selectedOptions) {
            this.selectedOptions = selectedOptions;
        },

        hasSelectedOption: function (option) {
            var i = 0;
            for (i; i < this.selectedOptions.length; i++) {
                if (this.selectedOptions[i].getValue() === option.getValue()) {
                    return true;
                }
            }
            return false;
        },

        putSelectedOption: function (option) {
            if (!this.hasSelectedOption(option)) {
                this.selectedOptions.push(option);
            }
        },

        removeSelectedOption: function (option) {
            var i = 0;
            for (i; i < this.selectedOptions.length; i++) {
                if (this.selectedOptions[i].getValue() === option.getValue()) {
                    this.selectedOptions.splice(i, 1);
                    return;
                }
            }
        },

        clearSelectedOptions: function () {
            this.selectedOptions = [];
        },

        hasSelectedOptions: function () {
            return this.selectedOptions.length > 0;
        },

        getSelectedOptionsValues: function () {
            var valueArr = [];
            angular.forEach(this.selectedOptions, function (opt) {
                valueArr.push(opt.getValue());
            });
            return valueArr;
        },

        getSelectedLabel: function () {
            var label = '';
            angular.forEach(this.selectedOptions, function (opt) {
                label += (label === '' ? '' : ', ') + opt.label;
            });
            return label === '' ? this.resetLabel : label;
        },

        getResetLabel: function () {
            return this.resetLabel;
        },

        setResetLabel: function (resetLabel) {
            this.resetLabel = resetLabel;
        },

        isLocked: function () {
            return this.lock;
        },

        getView: function () {
            return this.view;
        },

        getOptions: function () {
            return this.options;
        },

        getOption: function (value) {
            var i = 0;
            for (i; i < this.options.length; i++) {
                if (this.options[i].getValue() === value) {
                    return this.options[i];
                }
            }
            return undefined;
        },

        setOptions: function (options) {
            if (!this.lockOptions) {
                this.options = options;
            }
        },

        putOption: function (option) {
            if (!this.lockOptions) {
                var i = 0;
                for (i; i < this.options.length; i++) {
                    if (this.options[i].getValue() === option.getValue()) {
                        // Updates
                        this.options[i].setLabel(option.getLabel());
                        this.options[i].setSubFilters(option.getSubFilters);
                        return;
                    }
                }
                this.options.push(option);
            }
        },

        hasOptions: function () {
            return this.options.length > 0;
        },

        clearOptions: function () {
            if (!this.lockOptions) {
                this.options = [];
            }
        },

        reset: function () {
            this.selectedOptions = [];
        },

        toString: function () {
            var representation = this.alias + ': ';
            if (this.type === 'array') {
                representation += '[';
            }
            if (angular.isArray(this.selectedOptions)) {
                angular.forEach($filter('orderBy')(this.selectedOptions, '+label'), function (option, index) {
                    representation += (index > 0 ? ', ' : '') + option.label;
                });
            } else {
                representation += this.selectedOptions;
            }
            if (this.type === 'array') {
                representation += ']';
            }
            return representation;
        }
    };

    this.make = function (config) {
        return new FacetedFilter(config);
    };

    this.makeTypeFilter = function (selectedOption, hidden) {
        var config = {
            alias: 'type',
            label: 'MARKET.RESOURCE_TYPE',
            resetLabel: 'MARKET.ALL_RESOURCE',
            options: [
                OptionFacetedFilter.make({
                    label: 'Corpus',
                    // value: 'corpora',
                    value: 'Corpus',
                    length: 1
                }),
                OptionFacetedFilter.make({
                    label: 'Lexique',
                    // value: 'lexicons',
                    value: 'Lexique',
                    length: 1
                }),
                OptionFacetedFilter.make({
                    label: 'Terminologie',
                    // value: 'terminologies',
                    value: 'Terminologie',
                    length: 1
                }),
                OptionFacetedFilter.make({
                    label: 'Outil',
                    // value: 'tools',
                    value: 'Outil',
                    length: 1
                }),
                OptionFacetedFilter.make({
                    label: 'Projet intégré',
                    // value: 'applications',
                    value: 'Projet intégré',
                    length: 1
                })
            ],
            lockOptions: true
        };
        if (hidden) {
            config.id = 'type';
            config.path = 'type';
            config.lock = true;
        } else {
            config.id = 'type';
            config.priority = 'high';
            config.view = 'dropdown-faceted-filter';
        }
        var filter = new FacetedFilter(config);
        if (selectedOption) {
            filter.putSelectedOption(filter.getOption(selectedOption));
        }
        return filter;
    };

    return this;

}]);
