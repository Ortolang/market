'use strict';

/**
 * @ngdoc service
 * @name ortolangVisualizers.ProcessesFiltersManager
 * @description
 * # ProcessesFiltersManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('ProcessesFiltersManager', ['$filter', 'moment', function ($filter, moment) {

            // Constructor
            function ProcessesFilter(config) {
                this.id = undefined;
                this.values = [];
                this.active = undefined;

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

                getValues: function () {
                    return this.values;
                },

                isActive: function () {
                    return this.active;
                },

                removeValue: function (val) {
                    return $filter('filter')(this.values, function(value) {return value !== val;});
                },

                addValue: function(val) {
                    if(this.values.indexOf(val)===-1) {
                        this.values.push(val);
                    }
                    return this.values;
                },

                addValues: function(values) {
                    angular.forEach(values, function(val){
                        this.addValue(val);
                    });
                    return this.values;
                }

            };

            // ---
            // MANAGER.
            // ---

            var filters = {};

            function getFilters() {
                return filters;
            }


            function getFilter(id) {
                return filters[id];
            }

            function addFilter(id, val){
                var filter = {}, values = [];
                if(filters[id]=== undefined) {
                    filter.id = id;
                    if(!angular.isArray(val)) {
                        values.push(val);
                    } else {
                        values = val;
                    }
                    filter.values = values;
                    filter.active = true;
                    filters[id] = new ProcessesFilter(filter);
                } else {
                    if(!angular.isArray(val)) {
                        filters[id].values = filters[id].addValue(val);
                    } else {
                        filters[id].values = filters[id].addValues(val);
                    }
                    filters[id].values.concat(values);
                    filters[id].active = true;
                }
            }

            function switchFilter(id, val){
                var filter = {}, values = [];
                if(filters[id]=== undefined) {
                    filter.id = id;
                    if(!angular.isArray(val)) {
                        values.push(val);
                    } else {
                        values = val;
                    }
                    filter.values = values;
                    filter.active = true;
                    filters[id] = new ProcessesFilter(filter);
                } else {
                    if(!angular.isArray(val)) {
                        filters[id].values = filters[id].addValue(val);
                    } else {
                        filters[id].values = val;
                    }
                    filters[id].active = true;
                }
                //console.debug(filters);
            }


            function toggleFilter(id, val){
                var filter = {}, values = [];
                if(filters[id]=== undefined) {
                    filter.id = id;
                    if(!angular.isArray(val)) {
                        values.push(val);
                    } else {
                        values = val;
                    }
                    filter.values = values;
                    filter.active = true;
                    filters[id] = new ProcessesFilter(filter);
                } else {
                    if(filters[id].values.indexOf(val) !== -1){
                        filters[id].values = filters[id].removeValue(val);
                    } else {
                        filters[id].values = filters[id].addValue(val);
                    }

                }
            }


            function removeFilter(id) {
                if(filters[id]!== undefined) {
                    filters[id].active = false;
                    filters[id].values = [];
                }
            }

            function filter(array) {
                var filtered = array;
                angular.forEach(filters, function(filter) {
                    if(filter.active) {
                        if (filter.id === 'date'){
                            filtered = $filter('filter')(filtered, function (item) {
                                var match = false;
                                angular.forEach(filter.values, function(val) {
                                    switch(val) {
                                        case 'all':
                                            return true;
                                        default:
                                            match = match || ( (item.stop !== undefined) && (moment().diff(moment(item.stop), val)<=1) );
                                    }
                                });
                                return match;
                            });
                        } else {
                            filtered = $filter('filter')(filtered, function (item) {
                                var match = false;
                                angular.forEach(filter.values, function(val) {
                                    match = match || (item[filter.id] !== undefined && item[filter.id].toLowerCase() === val.toLowerCase());
                                });
                                return match;
                            });
                        }
                    }
                });
                return filtered;
            }

            function init(config) {
                angular.forEach(config, function(item) {
                    var filter = {};
                    filter = item;
                    filters[item.id] = new ProcessesFilter(filter);
                });
            }



            return {
                getFilters: getFilters,
                getFilter: getFilter,
                addFilter: addFilter,
                switchFilter: switchFilter,
                toggleFilter: toggleFilter,
                removeFilter: removeFilter,
                filter: filter,
                init: init
            };
        }]);
