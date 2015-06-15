'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.ItemManager
 * @description
 * # ItemManager
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('ItemManager', function () {

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

            getItems: function() {
                return this.items.slice();
            },

            addItem : function (item) {
                return this.items.push(item);
            },

            exists: function (item) {
                var i = 0;
                for (i; i < this.items.length; i++) {
                    if (this.items[i] === item) {
                        return true;
                    }
                }
                return false;
            },

            size: function() {
                return this.items.length;
            },

            isEmpty: function() {
                return this.items.length === 0;
            },

            clear: function() {
                this.items = [];
            }
        };

        this.make = function (config) {
            return new ItemManager(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };
    });
