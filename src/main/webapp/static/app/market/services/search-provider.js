'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.Search
 * @description
 * # Search
 * Factory in the ortolangMarketApp.
 * @property {Array}    results         - an array holding the results
 * @property {object}   viewModes       - the different available view modes
 * @property {object}   activeViewMode  - the active view mode
 * @property {object}   orderProps      - the different ways of ordering the results
 * @property {object}   activeOrderProp - the active way of ordering the results
 * @property {boolean}  orderReverse    - if reverse ordering
 */
angular.module('ortolangMarketApp').factory('SearchProvider', [ '$filter', 'SearchResource', 'icons', 'Helper', function ($filter, SearchResource, icons, Helper) {

    var tmpResults; // a temporary array holding the results while they are being processed

    // Constructor
    function SearchProvider(config) {
        this.results = null;
        this.aggregations = null;
        this.countResults = 0;
        this.viewModes = {
            line: {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'},
            tile: {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'}
        };
        this.activeViewMode = this.viewModes.tile;

        this.orderProps = {
            title: {id: 'title', sort: 'effectiveTitle', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'},
            rank: {id: 'rank', sort: ['effectiveRank','publicationDate'], label: 'MARKET.SORT.RANK', text: 'MARKET.SORT.RANK'},
            publicationDate: {id: 'publicationDate', sort: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'}
        };
        this.activeOrderProp = this.orderProps.rank;
        this.orderReverse = true;

        angular.forEach(config, function (value, key) {
            if (this.hasOwnProperty(key)) {
                this[key] = value;
            }
        }, this);
    }

    // Methods
    SearchProvider.prototype = {

        clearResults: function () {
            this.results = null;
            tmpResults = undefined;
        },

        hasResults: function () {
            return this.results && this.results.length > 0;
        },

        endProcessing: function () {
            this.results = tmpResults;
            tmpResults = undefined;
        },

        isProcessing: function () {
            return tmpResults !== undefined;
        },

        getResult: function (wskey) {
            var i = 0, array = tmpResults || this.results;
            for (i; i < array.length; i++) {
                if (array[i].wskey === wskey) {
                    return array[i];
                }
            }
            return undefined;
        },

        removeResult: function (resultId) {
            var array = tmpResults || this.results,
                filteredResults;
            filteredResults = $filter('filter')(array, {'key': '!' + resultId}, true);
            if (tmpResults) {
                tmpResults = filteredResults;
            } else {
                this.results = filteredResults;
            }
        },

        search: function (param, noProcessing) {
            tmpResults = undefined;
            var Search = this;
            return SearchResource.items(param, function (data) {
                if (noProcessing) {
                    Search.results = [];
                    angular.forEach(data.hits, function (hit) {
                        Search.results.push(angular.fromJson(hit));
                    });
                    Search.aggregations = {};
                    angular.forEach(data.aggregations, function (agg) {
                        Search.aggregations[agg] = angular.fromJson(agg);
                    });
                    Search.countResults = data.hits.size;
                } else {
                    tmpResults = [];
                    angular.forEach(data.hits, function (hit) {
                        var hitObject = angular.fromJson(hit);
                        hitObject.effectiveTitle = Helper.getMultilingualValue(hit.title);
                        hitObject.effectiveRank = hit.rank ? hit.rank : 0;
                        tmpResults.push(hitObject);
                    });
                    Search.aggregations = {};
                    for (var aggName in data.aggregations) {
                        Search.aggregations[aggName] = [];
                        if (angular.isArray(data.aggregations[aggName])) {
                            angular.forEach(data.aggregations[aggName], function (aggValue) {
                                var decodedKey = decodeURIComponent((aggValue + '').replace(/\+/g, '%20'));
                                Search.aggregations[aggName].push(angular.fromJson(decodedKey));
                            });
                        }
                    }
                    Search.countResults = data.size;
                }
            });
        },

        addViewMode: function (viewMode) {
            this.viewModes[viewMode.id] = viewMode;
        },

        setActiveViewMode: function (viewModeId) {
            this.activeViewMode = this.viewModes[viewModeId] || this.viewModes.tile;
        },

        setActiveOrderProp: function (orderPropId, orderReverse) {
            this.activeOrderProp = this.orderProps[orderPropId] || this.orderProps.rank;
            if (orderReverse !== undefined) {
                this.orderReverse = orderReverse;
            }
        }
    };

    return {
        make: function (config) {
            return new SearchProvider(config);
        }
    };

}]);
