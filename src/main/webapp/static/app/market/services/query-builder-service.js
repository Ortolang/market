'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.QueryBuilderService
 * @description
 * # QueryBuilderService
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .provider('QueryBuilderService', [function () {

        // Constructor
        function QueryBuilder(config) {
            this.projection = '';
            this.source = '';
            this.conditions = '';

            angular.forEach(config, function (value, key) {
                if (this.hasOwnProperty(key)) {
                    this[key] = value;
                }
            }, this);
        }

        
        // Methods
        QueryBuilder.prototype = {


            select : function (properties) {
                this.projection = properties;
            },

            from : function (cls) {
                this.source = cls;
            },

            equals : function (name, content) {
                this.conditions += name+' = \'' + this.sanitize(content) + '\'';
            },

            containsText : function (name, content) {
                this.conditions += name+' containsText \'' + this.sanitize(content) + '\'';
            },

            in : function (name, arrayOfContent) {
                var inValue = '';
                var builder = this;
                angular.forEach(arrayOfContent, function(content) { 
                    inValue += ((inValue!=='')?', ':'') + '\'' + builder.sanitize(content) + '\'';
                });
                if(inValue!=='') {
                    this.conditions += name+' IN [' + inValue + ']';
                }
            },

            and : function () {
                this.conditions += ' AND ';
            },

            or : function () {
                this.conditions += ' OR ';
            },

            tokenize : function (content) {
                return content.split(' ');
            },

            sanitize : function (content) {
                return content.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-');
            },

            toString : function () {
                return 'SELECT '+this.projection+' FROM '+this.source+((this.conditions!=='')?' WHERE '+this.conditions:'');
            },
        };

        this.make = function (config) {
            return new QueryBuilder(config);
        };

        this.$get = function () {
            return {
                make: this.make
            };
        };
    }]);
