'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ItemManager
 * @description
 * # ItemManager
 * Service in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .service('ItemManager', function () {

        // Constructor
        function ItemManager(config) {
            this.items = [];

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }


        // Methods
        ItemManager.prototype = {

            getItems: function () {
                return this.items.slice();
            },

            addItem : function (item) {
                return this.items.push(item);
            },

            getItem: function (wskey) {
                var i = 0;
                for (i; i < this.items.length; i++) {
                    if (this.items[i].wskey && this.items[i].wskey === wskey) {
                        return this.items[i];
                    }
                }
                return undefined;
            },

            exists: function (item) {
                var i = 0;
                for (i; i < this.items.length; i++) {
                    if (this.items[i].wskey && item.wskey && this.items[i].wskey === item.wskey) {
                        return true;
                    }
                }
                return false;
            },

            setItem: function(item, newItem) {
                var i = 0;
                for (i; i < this.items.length; i++) {
                    if (this.items[i] === item) {
                        this.items[i] = newItem;
                    }
                }
            },

            size: function () {
                return this.items.length;
            },

            isEmpty: function () {
                return this.items.length === 0;
            },

            clear: function () {
                this.items = [];
            }
        };

        this.make = function (config) {
            return new ItemManager(config);
        };

        return this;
    });
