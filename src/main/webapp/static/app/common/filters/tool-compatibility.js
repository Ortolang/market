'use strict';

/**
 * @ngdoc Returns all tools compatible with the formats
 * @name ortolangMarketApp.filter:tool-compatibility
 * @function
 * @description
 * # tool-compatibility
 * Filter in the ortolangMarketApp.
 */
angular.module('ortolangMarketApp')
    .filter('toolCompatibility', function () {
        return function (tools, mimetype) {
        	var tools = [], i = 0;
        	for (i = 0; i < tools.length; i++) {
                console.log(tools[i]);
            }
            return tools;
        };
    });
