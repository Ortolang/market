'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Search
 * @description
 * # Search
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').service('Search', ['$filter', '$q', 'SearchResource', function ($filter, $q, SearchResource) {

    var results = [], tmp;

    this.clearResults = function () {
        results = [];
        tmp = undefined;
    };

    this.hasResults = function () {
        return results.length > 0;
    };

    this.getResults = function () {
        return results;
    };

    this.endProcessing = function () {
        results = tmp;
        tmp = undefined;
    };

    this.isProcessing = function () {
        return tmp !== undefined;
    };

    this.getResult = function (wskey) {
        var i = 0, array = tmp || results;
        for (i; i < array.length; i++) {
            if (array[i].wskey === wskey) {
                return array[i];
            }
        }
        return undefined;
    };

    this.removeResult = function (resultId) {
        var array = tmp || results,
            filteredResults;
        filteredResults = $filter('filter')(array, {'@rid': '!' + resultId});
        if (tmp) {
            tmp = filteredResults;
        } else {
            results = filteredResults;
        }
    };

    this.search = function (query, noProcessing) {
        this.clearResults();
        return SearchResource.json({query: query}, function (data) {
            if (noProcessing) {
                results = data;
            } else {
                tmp = data;
            }
        });
    };

    return this;

}]);
