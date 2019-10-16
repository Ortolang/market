'use strict';

/**
 * @ngdoc component
 * @name ortolangMarketApp.component:facetFilterResults
 * @description
 * # facetFilterResults
 * Component of the ortolangMarketApp
 */
angular.module('ortolangMarketApp')
    .component('facetFilterResults', {
        bindings: {
            search: '='
        },
        controller: ['SearchProvider', function (SearchProvider) {
            var ctrl = this, subscription;

            function onSearch(s) {
                ctrl.search.endProcessing();
                if (ctrl.search.results !== null) {
                    ctrl.results = ctrl.search.results;
                }
            }

            ctrl.$onInit = function () {
                ctrl.results = [];
                subscription = ctrl.search.onSearch(onSearch);
            };

            ctrl.$onDestroy = function () {
                subscription.dispose();
            };

        }],
        templateUrl: 'market/components/facet-filter-results.component.html'
    });
