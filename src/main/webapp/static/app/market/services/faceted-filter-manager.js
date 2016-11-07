'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FacetedFilterManager', ['QueryBuilderFactory', 'FacetedFilter', '$filter', 'Helper', function (QueryBuilderFactory, FacetedFilter, $filter, Helper) {

        // Constructor
        function FacetedFilterManager() {
            this.enabledFilters = [];
            this.availabledFilters = [];
            this.customProjections = [];
        }

        // Methods
        FacetedFilterManager.prototype = {

            addFilter: function (filter) {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        return this.enabledFilters;
                    }
                }
                return this.enabledFilters.push(filter);
            },

            getFilter: function (alias) {
                var i = 0;
                for (i; i < this.availabledFilters.length; i++) {
                    if (this.availabledFilters[i].alias === alias) {
                        return this.availabledFilters[i];
                    }
                }
            },

            removeFilter: function (filter) {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        filter.clearSelectedOptions();
                        this.enabledFilters.splice(i, 1);
                        return this.enabledFilters;
                    }
                }
            },

            clear: function () {
                this.enabledFilters = [];
            },

            resetFilter: function () {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    this.enabledFilters[i].clearSelectedOptions();
                    delete this.enabledFilters[i];
                }
                this.enabledFilters = [];
            },

            addAvailableFilter: function (filter) {
                var i = 0;
                for (i; i < this.availabledFilters.length; i++) {
                    if (this.availabledFilters[i].id === filter.id) {
                        return this.availabledFilters;
                    }
                }
                return this.availabledFilters.push(filter);
            },

            getHighFilters: function () {
                return $filter('filter')(this.availabledFilters, {priority: 'high'}, true);
            },

            removeOptionFilter: function (filter, opt) {
                filter.removeSelectedOption(opt);
                if (!filter.hasSelectedOptions()) {
                    this.removeFilter(filter);
                }
            },

            enabledParamsFilter: function() {
                var filters = {};
                angular.forEach(this.enabledFilters, function (filter) {

                    var arrValue = [];
                    angular.forEach(filter.getSelectedOptions(), function (opt) {
                        arrValue.push(opt.getValue());
                    });

                    filters[filter.id] = arrValue;

                });

                return filters;
            },

            addCustomProjection: function (propertyName, propertyAlias) {
                this.customProjections.push({name: propertyName, alias: propertyAlias});
            },

            toAnalytics: function (content) {
                var result = content || '';
                angular.forEach($filter('orderBy')(this.enabledFilters, '+alias'), function (filter) {
                    if (filter.getPriority() === 'high' && filter.alias !== 'type') {
                        result += (result === '' ? '' : ' | ') + filter.toString();
                    }
                });
                return result;
            },

            init: function (type, configurations) {
                var Manager = this;
                var filter = FacetedFilter.makeTypeFilter(type, true);
                this.addAvailableFilter(filter);
                angular.forEach(configurations, function (config) {
                    config.id = Helper.prefix.metaItem + config.alias + '.key';
                    config.path = Helper.prefix.metaItem + config.alias;
                    var filter = FacetedFilter.make(config);
                    return Manager.addAvailableFilter(filter);
                });
            }
        };

        return {
            make: function () {
                return new FacetedFilterManager();
            }
        };

    }]);
