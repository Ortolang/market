'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.FacetedFilterManagerService
 * @description
 * # FacetedFilterManagerService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('FacetedFilterManager', ['FacetedFilter', '$filter', 'Helper', function (FacetedFilter, $filter, Helper) {

        var subject = new Rx.Subject();

        // Constructor
        function FacetedFilterManager() {
            this.enabledFilters = [];
            this.availabledFilters = [];
            this.customProjections = [];
        }

        // Methods
        FacetedFilterManager.prototype = {

            addEnabledFilter: function (filter) {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    if (this.enabledFilters[i].getId() === filter.getId()) {
                        // Sends event after processing changes
                        // subject.onNext(filter);
                        return this.enabledFilters;
                    }
                }
                this.enabledFilters.push(filter);
                // Sends event after processing changes
                // subject.onNext(filter);
                return this.enabledFilters;
            },

            getFilter: function (alias) {
                var i = 0;
                for (i; i < this.availabledFilters.length; i++) {
                    if (this.availabledFilters[i].alias === alias) {
                        return this.availabledFilters[i];
                    }
                }
            },

            removeEnabledFilter: function (filter) {
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
                // Sends event after processing changes
                // subject.onNext();
            },

            resetEnabledFilters: function () {
                var i = 0;
                for (i; i < this.enabledFilters.length; i++) {
                    this.enabledFilters[i].clearSelectedOptions();
                    delete this.enabledFilters[i];
                }
                this.enabledFilters = [];
                // Sends event after processing changes
                // subject.onNext();
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
                    this.removeEnabledFilter(filter);
                }
                // Sends event after processing changes
                // subject.onNext(filter);
            },

            applyFilters: function () {
                // Sends event after processing changes
                subject.onNext();
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

            onEnabledFilterChange: function (subscriber) {
                return subject.subscribe(subscriber);
            },

            init: function (type, configurations) {
                var Manager = this;
                if (configurations) {
                    angular.forEach(configurations, function (config) {
                        if (config.type === 'array' || config.type === 'object') {
                            config.id = config.alias + '.id';
                        } else {
                            config.id = config.alias;
                        }
                        var filter = FacetedFilter.make(config);
                        return Manager.addAvailableFilter(filter);
                    });
                }
            }
        };

        return {
            make: function () {
                return new FacetedFilterManager();
            }
        };

    }]);
