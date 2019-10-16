'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:facetFilterColumn
 * @description
 * # facetFilterColumn
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('facetFilterColumn', {
        bindings: {
            filtersManager: '=',
            search: '='
        },
        controller: ['Helper', 'OptionFacetedFilter', function (Helper, OptionFacetedFilter) {
            var ctrl = this, subscription, labels = {};

            /**
             * Listener on search action.
             * @param {SearchProvider} s 
             */
            function onSearch(s) {
                if (s.aggregations !== null) {
                    // setOptionsFilters();
                    initFacetedFilters(s.aggregations);
                }
            }

            /**
             * Initializes the facet filters
             * @param {Array} aggregations 
             */
            function initFacetedFilters(aggregations) {
                var i = 0;
                ctrl.facetedFilters = [];
                for (i; i < ctrl.filtersManager.availabledFilters.length; i++) {
                    labels[ctrl.filtersManager.availabledFilters[i].id] = ctrl.filtersManager.availabledFilters[i].label;
                    
                    if (aggregations[ctrl.filtersManager.availabledFilters[i].getAlias()]) {
                        setOptionsFilterBuckets(ctrl.filtersManager.availabledFilters[i], aggregations[ctrl.filtersManager.availabledFilters[i].getAlias()]);
                        ctrl.facetedFilters.push(ctrl.filtersManager.availabledFilters[i]);
                    }
                }
            }

            /**
             * Sets Options values for the filter.
             * @param {FacetedFilter} filter
             * @param {Array} buckets 
             */
            function setOptionsFilterBuckets(filter, buckets) {
                angular.forEach(buckets, function (bucket) {
                    var label = bucket, value = bucket;
                    var count = 1;
                    if (angular.isDefined(bucket.labels)) {
                        label = Helper.getMultilingualValue(bucket.labels);
                        // A quoi sert la variable global labels !!
                        labels[bucket.id] = label;
                        value = bucket.id;
                    } else if (angular.isDefined(bucket.fullname)) {
                        label = bucket.fullname;
                        labels[bucket.id] = label;
                        value = bucket.id;
                    }
                    if (!filter.getOption(label)) {
                        filter.putOption(OptionFacetedFilter.make({
                            label: label,
                            value: value,
                            length: count
                        }));
                    }
                });
            }

            ctrl.$onInit = function () {
                ctrl.facetedFilters = [];
                subscription = ctrl.search.onSearch(onSearch);
            };

            ctrl.$onDestroy = function () {
                subscription.dispose();
            };

        }],
        templateUrl: 'market/components/facet-filter-column.component.html'
    });
