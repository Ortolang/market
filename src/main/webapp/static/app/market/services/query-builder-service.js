'use strict';

/**
 * @ngdoc service
 * @name ortolangMarketApp.QueryBuilderFactory
 * @description
 * # QueryBuilderFactory
 * Factory in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .factory('QueryBuilderFactory', [function () {

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

            addProjection : function (propertyName, propertyAlias) {
                this.projection += ', ' + propertyName + ' as ' + propertyAlias;
                return this;
            },

            from : function (cls) {
                this.source = cls;
                return this;
            },

            equals : function (name, content) {
                if (angular.isArray(content)) {
                    var optionalValues = '';
                    angular.forEach(content, function (val) {
                        optionalValues += (optionalValues === '' ? '' : ' OR ') + name + ' = ' + getValue(val);
                    });
                    this.conditions += '(' + optionalValues + ')';
                } else {
                    this.conditions += name + ' = ' + getValue(content);
                }
                return this;
            },

            contains : function (name, content) {
                //TODO if content is an array
                this.conditions += name + ' contains \'' + sanitize(content) + '\'';
                return this;
            },

            containsText : function (name, content) {
                this.conditions += 'any() traverse(0,3) (' + name + '.toLowerCase().indexOf(\'' + sanitize(content.toLowerCase()) + '\') > -1 )';
                // this.conditions += name + ' containsText \'' + this.sanitize(content) + '\'';
                return this;
            },

            in : function (name, arrayOfContent) {
                var inValue = '';
                angular.forEach(arrayOfContent, function (content) {
                    // inValue += ((inValue !== '') ? ', ' : '') + '\'' + builder.sanitize(content) + '\'';
                    inValue += ((inValue !== '') ? ', ' : '') + sanitize(content);
                });
                if (inValue !== '') {
                    this.conditions += name + ' IN [' + inValue + ']';
                }
                return this;
            },

            and : function () {
                this.conditions += ' AND ';
                return this;
            },

            or : function () {
                this.conditions += ' OR ';
                return this;
            },

            tokenize : function (content) {
                return content.split(' ');
            },

            toString : function () {
                return 'SELECT ' + this.projection + ' FROM ' + this.source + ((this.conditions !== '') ? ' WHERE ' + this.conditions : '');
            }
        };

        function getValue(value) {
            var typeOfValue = typeof value;
            if(typeOfValue === 'string') {
                return '\'' + sanitize(value) + '\'';
            } else {
                return sanitize(value);
            }
        }

        function sanitize (content) {
            if(typeof(content.replace) === typeof(Function)) {
                return content.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\-/g, '\\-').replace(/'/g, '\\\'');
            } else {
                return content;
            }
        }

        function make(config) {
            return new QueryBuilder(config);
        }

        return {
            make: make
        };

    }]);
