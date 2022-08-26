'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:facetFilterCell
 * @description
 * # facetFilterCell
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('facetFilterCell', {
        bindings: {
            filter: '=',
            filtersManager: '='
        },
        controller: ['$location', function ($location) {
            var ctrl = this;
            /**
             * Adds an option value to the selection of the filter.
             **/
            function addSelectedOptionFilter(filter, optionValue) {
                if (angular.isArray(optionValue)) {
                    angular.forEach(optionValue, function (opt) {
                        filter.putSelectedOption(filter.getOption(opt));
                    });
                } else {
                    filter.putSelectedOption(filter.getOption(optionValue));
                }
            }
            /**
             * Sets to true or false the value of an option filter.
             * @param {OptionFacetedFilter} opt
             */
            ctrl.switchFilter = function (opt) {
                if (ctrl.filter.hasSelectedOption(opt)) {
                    ctrl.filtersManager.removeOptionFilter(ctrl.filter, opt);
                } else {
                    addSelectedOptionFilter(ctrl.filter, opt.getValue());
                    ctrl.filtersManager.addEnabledFilter(ctrl.filter);
                }
                ctrl.filtersManager.applyFilters();
                // ctrl.applyFilters();
            };

            ctrl.$onInit = function () {
                // ctrl.values = ['Corpus', 'Lexique', 'Outil'];
            };
        }],
        templateUrl: 'market/components/facet-filter-cell.component.html'
    });
