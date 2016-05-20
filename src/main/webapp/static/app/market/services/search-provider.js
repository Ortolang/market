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
angular.module('ortolangMarketApp').factory('SearchProvider', [ 'SearchResource', 'icons', 'Helper', function ( SearchResource, icons, Helper) {

    var tmpResults; // a temporary array holding the results while they are being processed

    // Constructor
    function SearchProvider(config) {
        this.results = null;
        this.viewModes = {
            line: {id: 'line', icon: icons.browser.viewModeLine, text: 'MARKET.VIEW_MODE.LINE'},
            tile: {id: 'tile', icon: icons.browser.viewModeTile, text: 'MARKET.VIEW_MODE.GRID'}
        };
        this.activeViewMode = this.viewModes.tile;

        this.orderProps = {
            title: {id: 'title', sort: 'effectiveTitle', label: 'MARKET.SORT.TITLE', text: 'MARKET.SORT.TITLE'},
            publicationDate: {id: 'publicationDate', sort: 'publicationDate', label: 'MARKET.SORT.PUBLICATION_DATE', text: 'MARKET.SORT.PUBLICATION_DATE'}
        };
        this.activeOrderProp = this.orderProps.publicationDate;
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

        pack: function () {
            if (tmpResults) {
                tmpResults = Helper.pack(tmpResults);
            }
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
                if (array[i]['meta_ortolang-workspace-json'].wskey === wskey) {
                    return array[i];
                }
            }
            return undefined;
        },

        removeResult: function (resultId) {
            var array = tmpResults || this.results,
                filteredResults;
            // filteredResults = $filter('filter')(array, {'key': '!' + resultId}, true);
            // if (tmpResults) {
            //     tmpResults = filteredResults;
            // } else {
            //     this.results = filteredResults;
            // }
        },

        search: function (param, noProcessing) {
            tmpResults = undefined;
            var Search = this;
            return SearchResource.findCollections(param, function (data) {
                if (noProcessing) {
                    Search.results = data;
                } else {
                    tmpResults = data;
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
            this.activeOrderProp = this.orderProps[orderPropId] || this.orderProps.publicationDate;
            if (orderReverse !== undefined) {
                this.orderReverse = orderReverse;
            }
        }
    };

    // this.make = function (config) {
    //     if (!config.id || !config.compatibleTypes || !config.name  || !config.name.fr) {
    //         console.error('id, name and compatiblesTypes are mandatory', config);
    //         return {};
    //     }
    //     if (!/^[A-Z]/.test(config.id)) {
    //         console.error('id must start with an upper-case letter', config.id);
    //         return {};
    //     }
    //     return new SearchProvider(config);
    // };

    // this.$get = function () {
    //     return {
    //         make: this.make
    //     };
    // };

    return {
        make: function (config) {
            return new SearchProvider(config);
        }
    };

}]);
