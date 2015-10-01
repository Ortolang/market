'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Search
 * @description
 * # Search
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp').service('Search', ['$filter', '$q', 'SearchResource', 'icons', function ($filter, $q, SearchResource, icons) {

    var results = [],   // an array holding the results
        tmpResults,     // an temporary array holding the results while they are being processed
        viewModes,      // the different view modes
        activeViewMode, // the active view mode
        orderProps,     // the different ways of ordering the results
        activeOrderProp,// the active way of ordering the result
        orderDirection;

    this.clearResults = function () {
        results = [];
        tmpResults = undefined;
    };

    this.hasResults = function () {
        return results.length > 0;
    };

    this.getResults = function () {
        return results;
    };

    this.endProcessing = function () {
        results = tmpResults;
        tmpResults = undefined;
    };

    this.isProcessing = function () {
        return tmpResults !== undefined;
    };

    this.getResult = function (wskey) {
        var i = 0, array = tmpResults || results;
        for (i; i < array.length; i++) {
            if (array[i].wskey === wskey) {
                return array[i];
            }
        }
        return undefined;
    };

    this.removeResult = function (resultId) {
        var array = tmpResults || results,
            filteredResults;
        filteredResults = $filter('filter')(array, {'@rid': '!' + resultId});
        if (tmpResults) {
            tmpResults = filteredResults;
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
                tmpResults = data;
            }
        });
    };

    this.addViewMode = function (viewMode) {
        viewModes[viewMode.id] = viewMode;
    };

    this.getActiveViewMode = function () {
        return activeViewMode;
    };

    this.setActiveViewMode = function (viewModeId) {
        activeViewMode = viewModes[viewModeId] || viewModes.tile;
    };

    this.getViewModes = function () {
        return viewModes;
    };

    this.getOrderProps = function () {
        return orderProps;
    };

    this.getActiveOrderProp = function () {
        return activeOrderProp;
    };

    this.setActiveOrderProp = function (orderPropId, newOrderDirection) {
        activeOrderProp = orderProps[orderPropId] || orderProps.publicationDate;
        if (newOrderDirection !== undefined) {
            orderDirection = newOrderDirection;
        }
    };

    this.getOrderDirection = function () {
        return orderDirection;
    };

    function init() {
        viewModes = {
            line: {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'},
            tile: {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'}
        };
        activeViewMode = viewModes.tile;

        orderProps = {
            title: {id: 'title', sort: 'titleToSort', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'},
            publicationDate: {id: 'publicationDate', sort: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'}
        };
        activeOrderProp = orderProps.publicationDate;
        orderDirection = true;
    }
    init();

    return this;

}]);
